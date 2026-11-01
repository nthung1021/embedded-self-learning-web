/* Ngân hàng câu hỏi sơ đồ AUTOSAR - Đề 4 (12 câu: 5 danh sách thả xuống, 5 kéo thả, 2 câu ghép).
   Mỗi câu: { type: 'dd' | 'dnd' | 'match', lesson, title, explain, ... }
   - dd và dnd: kind (layers, chain, table, fields, seq), pool, data
       Ô trống được viết là { b: 'đáp án đúng', o: [lựa chọn riêng], span: số cột }
       dd: lựa chọn của ô trống lấy từ o, nếu không có thì lấy từ pool
       dnd: pool là toàn bộ các mục kéo, gồm cả mục gây nhiễu
   - match: pairs là danh sách [mã hex cố định, tên đúng]; trang tự xáo trộn các tên */
var QUIZ_BANK = (function () {
    var LAYER = ['Services Layer', 'ECU Abstraction Layer', 'Microcontroller Abstraction Layer', 'Complex Drivers'];
    var EVENT = ['Hết một chu kỳ cố định', 'Có dữ liệu mới tại port nhận', 'Có operation của server được gọi',
        'Chuyển sang một chế độ mới', 'Ngay khi RTE khởi động xong'];

    return [

        /* 1. Thiết kế: kiến trúc phân lớp AUTOSAR Classic (danh sách thả xuống) */
        {
            type: 'dd', lesson: 2, kind: 'layers',
            title: 'Sơ đồ kiến trúc phân lớp của AUTOSAR Classic. Điền tên từng lớp theo mô tả bên trái, theo thứ tự từ ứng dụng xuống vi điều khiển.',
            pool: ['Runtime Environment', 'Services Layer', 'ECU Abstraction Layer', 'Microcontroller Abstraction Layer', 'Complex Drivers'],
            data: [
                { tag: 'Lớp ứng dụng', x: 'Các SWC' },
                { tag: 'Kết nối SWC với Basic Software', x: { b: 'Runtime Environment' } },
                { tag: 'Hệ điều hành, bộ nhớ và chẩn đoán', x: { b: 'Services Layer' } },
                { tag: 'Che giấu cách bố trí phần cứng của ECU', x: { b: 'ECU Abstraction Layer' } },
                { tag: 'Driver gắn với vi điều khiển', x: { b: 'Microcontroller Abstraction Layer' } },
                { tag: 'Phần cứng', x: 'Vi điều khiển' }
            ],
            explain: 'Từ trên xuống là lớp ứng dụng chứa các SWC, Runtime Environment, rồi Basic Software gồm Services Layer, ECU Abstraction Layer và Microcontroller Abstraction Layer, dưới cùng là vi điều khiển. Complex Drivers nằm ngang trong Basic Software để truy cập phần cứng trực tiếp nên không nằm trong thứ tự phân tầng này.'
        },

        /* 2. Thiết kế: phân tầng các module BSW (danh sách thả xuống) */
        {
            type: 'dd', lesson: 7, kind: 'table',
            title: 'Bảng phân tầng các module trong Basic Software. Chọn lớp chứa từng module.',
            pool: [],
            data: {
                rh: true,
                head: ['Module', 'Lớp chứa module'],
                rows: [
                    ['EcuM', { b: 'Services Layer', o: LAYER }],
                    ['IoHwAb', { b: 'ECU Abstraction Layer', o: LAYER }],
                    ['Fls', { b: 'Microcontroller Abstraction Layer', o: LAYER }],
                    ['CanTrcv', { b: 'ECU Abstraction Layer', o: LAYER }],
                    ['Dem', { b: 'Services Layer', o: LAYER }],
                    ['Adc', { b: 'Microcontroller Abstraction Layer', o: LAYER }]
                ]
            },
            explain: 'EcuM và Dem thuộc Services Layer; IoHwAb và CanTrcv thuộc ECU Abstraction Layer; Fls và Adc là driver của MCAL. Complex Drivers là nhóm riêng cho driver đặc thù không có module chuẩn, nên không module nào trong bảng thuộc nhóm này.'
        },

        /* 3. Thiết kế: RTE event và điều kiện kích hoạt runnable (danh sách thả xuống) */
        {
            type: 'dd', lesson: 13, kind: 'table',
            title: 'Bảng các RTE event dùng để kích hoạt runnable. Chọn điều kiện kích hoạt ứng với từng event.',
            pool: [],
            data: {
                rh: true,
                head: ['RTE event', 'Điều kiện kích hoạt runnable'],
                rows: [
                    ['TimingEvent', { b: 'Hết một chu kỳ cố định', o: EVENT }],
                    ['DataReceivedEvent', { b: 'Có dữ liệu mới tại port nhận', o: EVENT }],
                    ['OperationInvokedEvent', { b: 'Có operation của server được gọi', o: EVENT }],
                    ['ModeSwitchEvent', { b: 'Chuyển sang một chế độ mới', o: EVENT }]
                ]
            },
            explain: 'TimingEvent kích hoạt theo chu kỳ, DataReceivedEvent khi có dữ liệu mới tại port nhận, OperationInvokedEvent khi một operation của server được gọi và ModeSwitchEvent khi chuyển chế độ. Điều kiện còn lại là của InitEvent, không có trong bảng.'
        },

        /* 4. Luồng: wake-up từ bus CAN (danh sách thả xuống) */
        {
            type: 'dd', lesson: 10, kind: 'chain',
            title: 'Luồng xử lý khi ECU đang ngủ và bus CAN có hoạt động (sơ đồ rút gọn ở mức module). Điền module còn thiếu vào từng bước.',
            pool: ['CanIf', 'EcuM', 'ComM', 'CanSM', 'Dcm', 'NvM'],
            data: [
                { x: 'Bus CAN có hoạt động khi ECU đang ngủ' },
                { v: 'Phát hiện wake-up', x: 'CanTrcv' },
                { v: 'Báo sự kiện', x: { b: 'CanIf' } },
                { v: 'Ghi nhận wakeup event', x: { b: 'EcuM' } },
                { v: 'Yêu cầu giao tiếp', x: { b: 'ComM' } },
                { v: 'Đưa mạng sang trạng thái giao tiếp', x: { b: 'CanSM' } }
            ],
            explain: 'CanTrcv phát hiện wake-up và báo cho CanIf, CanIf chuyển sự kiện cho EcuM, EcuM kiểm tra rồi báo cho ComM, và ComM yêu cầu CanSM đưa mạng sang trạng thái giao tiếp. Dcm và NvM không tham gia luồng này.'
        },

        /* 5. Luồng: khởi động ECU (danh sách thả xuống) */
        {
            type: 'dd', lesson: 18, kind: 'chain',
            title: 'Luồng khởi động ECU do EcuM điều phối. Điền hàm được gọi ở từng bước.',
            pool: ['EcuM_Init', 'StartOS', 'EcuM_StartupTwo', 'Rte_Start', 'EcuM_GoDown'],
            data: [
                { x: 'Vi điều khiển reset và chạy hàm main' },
                { v: 'main gọi', x: { b: 'EcuM_Init' } },
                { v: 'Sau khi khởi tạo driver giai đoạn đầu', x: { b: 'StartOS' } },
                { v: 'Task đầu tiên của OS gọi', x: { b: 'EcuM_StartupTwo' } },
                { v: 'Khởi động tầng RTE', x: { b: 'Rte_Start' } },
                { v: 'Hoàn tất khởi động', x: 'Pha UP, các MainFunction chạy định kỳ' }
            ],
            explain: 'main gọi EcuM_Init để khởi tạo giai đoạn đầu rồi gọi StartOS; sau khi OS chạy, một task gọi EcuM_StartupTwo để hoàn tất giai đoạn hai, trong đó có Rte_Start; xong thì ECU vào pha UP. EcuM_GoDown dùng khi tắt hoặc ngủ. Vị trí chính xác của Rte_Start có thể khác theo phiên bản và cấu hình.'
        },

        /* 6. Thiết kế: Diagnostic Stack trên CAN (kéo thả) */
        {
            type: 'dnd', lesson: 19, kind: 'layers',
            title: 'Sơ đồ thiết kế Diagnostic Stack trên CAN, theo chiều đi của một request từ phần cứng lên tầng chẩn đoán. Điền module vào từng tầng.',
            pool: ['Dcm', 'PduR', 'CanTp', 'CanIf', 'Can', 'Dem', 'Com'],
            data: [
                { tag: 'Phần cứng', x: 'CAN Controller' },
                { tag: 'Driver của MCAL', x: { b: 'Can' } },
                { tag: 'Giao diện với driver', x: { b: 'CanIf' } },
                { tag: 'Ghép các frame thành bản tin dài', x: { b: 'CanTp' } },
                { tag: 'Định tuyến PDU', x: { b: 'PduR' } },
                { tag: 'Xử lý yêu cầu chẩn đoán', x: { b: 'Dcm' } }
            ],
            explain: 'Request đi từ CAN controller lên Can driver, CanIf, CanTp để ghép các frame, PduR để định tuyến rồi tới Dcm. Dem lưu lỗi và Com xử lý signal ứng dụng nên không nằm trên đường này.'
        },

        /* 7. Luồng: ghi dữ liệu bền vững (kéo thả) */
        {
            type: 'dnd', lesson: 17, kind: 'chain',
            title: 'Luồng ghi một block dữ liệu bền vững từ ứng dụng xuống bộ nhớ flash qua Memory Stack. Điền module vào từng bước.',
            pool: ['NvM', 'MemIf', 'Fee', 'Fls', 'Ea', 'Dem', 'Eep'],
            data: [
                { x: 'SWC thông qua RTE' },
                { v: 'Yêu cầu ghi block', x: { b: 'NvM' } },
                { v: 'Chuyển yêu cầu tới thiết bị bộ nhớ', x: { b: 'MemIf' } },
                { v: 'Quản lý các trang flash', x: { b: 'Fee' } },
                { v: 'Truy cập thanh ghi flash', x: { b: 'Fls' } },
                { v: 'Ghi dữ liệu', x: 'Bộ nhớ flash của vi điều khiển' }
            ],
            explain: 'NvM nhận yêu cầu từ ứng dụng, MemIf chọn thiết bị bộ nhớ, Fee mô phỏng EEPROM trên flash rồi Fls ghi xuống flash. Ea và Eep là cặp module dành cho EEPROM thật, còn Dem không thuộc Memory Stack.'
        },

        /* 8. Luồng: xử lý một request trong Dcm (kéo thả) */
        {
            type: 'dnd', lesson: 26, kind: 'chain',
            title: 'Luồng xử lý một yêu cầu chẩn đoán bên trong Dcm. Điền thành phần của Dcm phụ trách từng bước.',
            pool: ['DSL', 'DSD', 'DSP', 'CanTp', 'ComM'],
            data: [
                { x: 'PduR chuyển request đến Dcm' },
                { v: 'Nhận request, quản lý session và thời gian', x: { b: 'DSL' } },
                { v: 'Kiểm tra SID, session và mức bảo mật', x: { b: 'DSD' } },
                { v: 'Xử lý nội dung dịch vụ', x: { b: 'DSP' } },
                { v: 'Lấy hoặc ghi dữ liệu', x: 'Dem, NvM hoặc ứng dụng' }
            ],
            explain: 'DSL nhận request và quản lý session cùng các tham số thời gian; DSD kiểm tra SID, session và mức bảo mật rồi chuyển cho DSP; DSP xử lý nội dung dịch vụ và gọi Dem, NvM hoặc ứng dụng. CanTp và ComM không nằm trong Dcm.'
        },

        /* 9. Luồng: trao đổi giữa CanIf và Can driver (kéo thả) */
        {
            type: 'dnd', lesson: 13, kind: 'seq',
            title: 'Lưu đồ trao đổi hàm giữa CanIf và Can driver khi đưa controller vào hoạt động rồi gửi một frame. Mũi tên cho biết chiều của lời gọi hoặc thông báo.',
            pool: ['Can_SetControllerMode', 'CanIf_ControllerModeIndication', 'Can_Write', 'CanIf_TxConfirmation', 'Can_Init', 'CanIf_RxIndication', 'CanIf_ControllerBusOff'],
            data: {
                l: 'CanIf', r: 'Can driver',
                rows: [
                    { d: 'r', x: { b: 'Can_SetControllerMode' }, s: 'chuyển sang STARTED' },
                    { d: 'l', x: { b: 'CanIf_ControllerModeIndication' }, s: 'báo đã chuyển xong' },
                    { d: 'r', x: { b: 'Can_Write' }, s: 'đưa frame vào hardware object' },
                    { d: 'l', x: { b: 'CanIf_TxConfirmation' }, s: 'báo frame đã gửi xong' }
                ]
            },
            explain: 'CanIf gọi Can_SetControllerMode để đổi chế độ và Can driver báo kết quả bằng CanIf_ControllerModeIndication; sau đó CanIf gọi Can_Write để gửi frame và Can driver báo gửi xong bằng CanIf_TxConfirmation. Can_Init do EcuM gọi, CanIf_RxIndication dùng khi nhận frame và CanIf_ControllerBusOff dùng khi bus-off.'
        },

        /* 10. Luồng: nạp firmware bằng UDS (kéo thả, điền SID) */
        {
            type: 'dnd', lesson: 30, kind: 'chain',
            title: 'Luồng nạp phần mềm cho ECU bằng UDS thông qua Flash Bootloader. Điền SID mà tester gửi ở từng bước.',
            pool: ['0x10', '0x27', '0x31', '0x34', '0x36', '0x37', '0x11', '0x3E', '0x22'],
            data: [
                { x: 'ECU đang ở default session' },
                { v: ['Tester gửi', { b: '0x10' }], x: 'ECU vào programming session' },
                { v: ['Tester gửi', { b: '0x27' }], x: 'ECU mở khóa bảo mật' },
                { v: ['Tester gửi', { b: '0x31' }], x: 'ECU xóa vùng flash cần ghi' },
                { v: ['Tester gửi', { b: '0x34' }], x: 'ECU sẵn sàng nhận dữ liệu' },
                { v: ['Tester gửi', { b: '0x36' }], x: 'ECU nhận các khối dữ liệu' },
                { v: ['Tester gửi', { b: '0x37' }], x: 'ECU kết thúc việc nhận dữ liệu' }
            ],
            explain: 'Trình tự điển hình là 0x10 vào programming session, 0x27 mở khóa, 0x31 gọi routine xóa bộ nhớ, 0x34 báo địa chỉ và kích thước dữ liệu, 0x36 truyền từng khối rồi 0x37 kết thúc. Thứ tự giữa bước xóa và 0x34 có thể khác tùy nhà sản xuất. 0x11 khởi động lại ECU, 0x3E giữ session và 0x22 đọc dữ liệu nên không thuộc luồng chính này.'
        },

        /* 11. Câu ghép: SID của UDS */
        {
            type: 'match', lesson: 31,
            title: 'Ghép mỗi mã SID của UDS ở cột trái với tên dịch vụ tương ứng.',
            pairs: [
                ['0x10', 'DiagnosticSessionControl'],
                ['0x11', 'ECUReset'],
                ['0x14', 'ClearDiagnosticInformation'],
                ['0x19', 'ReadDTCInformation'],
                ['0x22', 'ReadDataByIdentifier'],
                ['0x23', 'ReadMemoryByAddress'],
                ['0x27', 'SecurityAccess'],
                ['0x28', 'CommunicationControl'],
                ['0x2A', 'ReadDataByPeriodicIdentifier'],
                ['0x2C', 'DynamicallyDefineDataIdentifier'],
                ['0x2E', 'WriteDataByIdentifier'],
                ['0x2F', 'InputOutputControlByIdentifier'],
                ['0x31', 'RoutineControl'],
                ['0x34', 'RequestDownload'],
                ['0x35', 'RequestUpload'],
                ['0x36', 'TransferData'],
                ['0x37', 'RequestTransferExit'],
                ['0x3D', 'WriteMemoryByAddress'],
                ['0x3E', 'TesterPresent'],
                ['0x85', 'ControlDTCSetting']
            ],
            explain: '0x10 đổi phiên chẩn đoán, 0x11 khởi động lại ECU, 0x14 xóa DTC, 0x19 đọc thông tin DTC, 0x22 đọc dữ liệu theo DID, 0x23 đọc bộ nhớ theo địa chỉ, 0x27 mở khóa bảo mật bằng seed và key, 0x28 bật hoặc tắt truyền thông, 0x2A đọc dữ liệu theo chu kỳ, 0x2C định nghĩa DID động, 0x2E ghi dữ liệu theo DID, 0x2F điều khiển ngõ vào ra, 0x31 điều khiển routine, 0x34 bắt đầu tải dữ liệu xuống ECU, 0x35 bắt đầu tải dữ liệu lên tester, 0x36 truyền từng khối dữ liệu, 0x37 kết thúc việc truyền, 0x3D ghi bộ nhớ theo địa chỉ, 0x3E giữ session đang mở và 0x85 bật hoặc tắt ghi DTC.'
        },

        /* 12. Câu ghép: NRC của UDS */
        {
            type: 'match', lesson: 27,
            title: 'Ghép mỗi mã NRC của UDS ở cột trái với tên mã phản hồi tiêu cực tương ứng.',
            pairs: [
                ['0x10', 'generalReject'],
                ['0x11', 'serviceNotSupported'],
                ['0x12', 'subFunctionNotSupported'],
                ['0x13', 'incorrectMessageLengthOrInvalidFormat'],
                ['0x14', 'responseTooLong'],
                ['0x21', 'busyRepeatRequest'],
                ['0x22', 'conditionsNotCorrect'],
                ['0x24', 'requestSequenceError'],
                ['0x26', 'failurePreventsExecutionOfRequestedAction'],
                ['0x31', 'requestOutOfRange'],
                ['0x33', 'securityAccessDenied'],
                ['0x35', 'invalidKey'],
                ['0x36', 'exceededNumberOfAttempts'],
                ['0x37', 'requiredTimeDelayNotExpired'],
                ['0x70', 'uploadDownloadNotAccepted'],
                ['0x72', 'generalProgrammingFailure'],
                ['0x73', 'wrongBlockSequenceCounter'],
                ['0x78', 'requestCorrectlyReceivedResponsePending'],
                ['0x7E', 'subFunctionNotSupportedInActiveSession'],
                ['0x7F', 'serviceNotSupportedInActiveSession']
            ],
            explain: '0x10 từ chối chung chung, 0x11 dịch vụ không được hỗ trợ, 0x12 sub-function không được hỗ trợ, 0x13 sai độ dài hoặc định dạng, 0x14 response quá dài so với buffer, 0x21 ECU đang bận nên tester gửi lại, 0x22 điều kiện chưa phù hợp, 0x24 sai thứ tự các yêu cầu, 0x26 lỗi ngăn việc thực hiện yêu cầu, 0x31 giá trị ngoài phạm vi, 0x33 chưa mở khóa bảo mật, 0x35 khóa gửi lên không hợp lệ, 0x36 vượt quá số lần thử, 0x37 chưa hết thời gian trễ yêu cầu, 0x70 từ chối việc tải lên hoặc tải xuống, 0x72 lỗi lập trình bộ nhớ, 0x73 sai blockSequenceCounter, 0x78 đã nhận yêu cầu nhưng response sẽ đến sau, 0x7E sub-function không hỗ trợ trong session hiện tại và 0x7F dịch vụ không hỗ trợ trong session hiện tại.'
        }

    ];
})();