/* Ngân hàng câu hỏi sơ đồ CAN - Đề 4 (8 câu: 4 danh sách thả xuống, 4 kéo thả).
   Mỗi câu: { type: 'dd' | 'dnd', lesson, title, kind, pool, data, explain }
   - Ô trống được viết là { b: 'đáp án đúng', o: [các lựa chọn riêng], span: số cột }
   - dd: lựa chọn của ô trống lấy từ o, nếu không có thì lấy từ pool
   - dnd: pool là toàn bộ các mục kéo, gồm cả mục gây nhiễu
   - kind: layers, chain, table, fields, seq */
var QUIZ_BANK = (function () {
    var ST = ['CAN_CS_UNINIT', 'CAN_CS_STOPPED', 'CAN_CS_STARTED', 'CAN_CS_SLEEP'];
    var CMD = ['CAN_T_START', 'CAN_T_STOP', 'CAN_T_SLEEP', 'CAN_T_WAKEUP'];
    var ERR = ['TEC hoặc REC lớn hơn 127', 'TEC hoặc REC lớn hơn 255', 'TEC lớn hơn 255', 'REC lớn hơn 255',
        '128 chuỗi 11 bit recessive liên tiếp', '128 chuỗi 11 bit dominant liên tiếp', '11 chuỗi 128 bit recessive liên tiếp'];
    var BIT = ['0', '1'];
    var WHO = ['Node A', 'Node B', 'Node C', 'Không có'];
    var WHO3 = ['Node A', 'Node B', 'Node C'];

    return [

        /* 1. Thiết kế: CAN Communication Stack (danh sách thả xuống) */
        {
            type: 'dd', lesson: 9, kind: 'layers',
            title: 'Sơ đồ thiết kế CAN Communication Stack theo AUTOSAR. Điền module vào từng tầng, theo thứ tự đi từ ứng dụng xuống phần cứng khi gửi một signal.',
            pool: ['Com', 'PduR', 'CanIf', 'Can', 'Dcm', 'NvM', 'Dem'],
            data: [
                { tag: 'Application Layer', x: 'SWC' },
                { tag: 'Runtime Environment', x: 'RTE' },
                { tag: 'Services Layer', x: { b: 'Com' } },
                { tag: 'Services Layer', x: { b: 'PduR' } },
                { tag: 'ECU Abstraction Layer', x: { b: 'CanIf' } },
                { tag: 'MCAL', x: { b: 'Can' } },
                { tag: 'Phần cứng', x: 'CAN Controller và CAN Transceiver' }
            ],
            explain: 'Signal đi từ SWC qua RTE xuống Com, rồi PduR định tuyến PDU, CanIf trừu tượng hóa các controller và transceiver, và Can driver ở MCAL truy cập phần cứng. Dcm, NvM và Dem không nằm trên đường gửi signal.'
        },

        /* 2. Thiết kế: cấu trúc data frame (kéo thả) */
        {
            type: 'dnd', lesson: 3, kind: 'fields',
            title: 'Cấu trúc một data frame CAN chuẩn, đọc theo thứ tự truyền từ trái sang phải và từ trên xuống dưới. Độ dài của mỗi trường được ghi bên dưới ô.',
            pool: ['Arbitration Field', 'Control Field', 'CRC Field', 'ACK Field', 'Error Flag', 'Interframe Space'],
            data: [
                { x: 'SOF', s: '1 bit' },
                { x: { b: 'Arbitration Field' }, s: '12 bit' },
                { x: { b: 'Control Field' }, s: '6 bit' },
                { x: 'Data Field', s: '0 đến 64 bit' },
                { x: { b: 'CRC Field' }, s: '16 bit' },
                { x: { b: 'ACK Field' }, s: '2 bit' },
                { x: 'EOF', s: '7 bit' }
            ],
            explain: 'Arbitration gồm Identifier 11 bit và RTR, Control gồm IDE, r0 và DLC 4 bit, CRC gồm 15 bit sequence và delimiter, ACK gồm slot và delimiter. Error Flag thuộc error frame còn Interframe Space nằm giữa hai frame nên cả hai không thuộc data frame.'
        },

        /* 3. Luồng: máy trạng thái của CAN controller (danh sách thả xuống) */
        {
            type: 'dd', lesson: 18, kind: 'table',
            title: 'Máy trạng thái của CAN controller trong Can driver. Hoàn thành bảng chuyển trạng thái.',
            pool: [],
            data: {
                head: ['Trạng thái hiện tại', 'Lệnh', 'Trạng thái kế tiếp'],
                rows: [
                    ['CAN_CS_UNINIT', 'Can_Init', { b: 'CAN_CS_STOPPED', o: ST }],
                    ['CAN_CS_STOPPED', { b: 'CAN_T_START', o: CMD }, 'CAN_CS_STARTED'],
                    [{ b: 'CAN_CS_STARTED', o: ST }, 'CAN_T_STOP', 'CAN_CS_STOPPED'],
                    ['CAN_CS_STOPPED', 'CAN_T_SLEEP', { b: 'CAN_CS_SLEEP', o: ST }],
                    ['CAN_CS_SLEEP', { b: 'CAN_T_WAKEUP', o: CMD }, 'CAN_CS_STOPPED']
                ]
            },
            explain: 'Can_Init đưa controller từ UNINIT sang STOPPED, CAN_T_START đưa sang STARTED, CAN_T_STOP đưa về STOPPED, CAN_T_SLEEP chỉ dùng từ STOPPED để vào SLEEP, và CAN_T_WAKEUP đưa từ SLEEP về STOPPED. STARTED không chuyển thẳng sang SLEEP.'
        },

        /* 4. Luồng: gửi signal lên bus (kéo thả) */
        {
            type: 'dnd', lesson: 19, kind: 'chain',
            title: 'Luồng gửi một signal từ ứng dụng lên bus CAN. Mỗi mũi tên là một lời gọi hàm giữa hai module.',
            pool: ['Com_SendSignal', 'PduR_ComTransmit', 'CanIf_Transmit', 'Can_Write', 'Com_TxConfirmation', 'CanIf_RxIndication', 'Can_SetControllerMode'],
            data: [
                { x: 'SWC thông qua RTE' },
                { v: ['RTE gọi', { b: 'Com_SendSignal' }], x: 'Com' },
                { v: ['Com gọi', { b: 'PduR_ComTransmit' }], x: 'PduR' },
                { v: ['PduR gọi', { b: 'CanIf_Transmit' }], x: 'CanIf' },
                { v: ['CanIf gọi', { b: 'Can_Write' }], x: 'Can driver' },
                { v: 'Ghi vào hardware transmit object', x: 'CAN Controller gửi frame lên bus' }
            ],
            explain: 'RTE gọi Com_SendSignal, Com gọi PduR_ComTransmit, PduR gọi CanIf_Transmit và CanIf gọi Can_Write để đặt frame vào hardware transmit object. Com_TxConfirmation và CanIf_RxIndication là callback đi ngược lên, còn Can_SetControllerMode dùng để đổi chế độ controller.'
        },

        /* 5. Luồng: các trạng thái lỗi của node (danh sách thả xuống) */
        {
            type: 'dd', lesson: 22, kind: 'chain',
            title: 'Sơ đồ các trạng thái lỗi của một node CAN. Điền điều kiện chuyển trạng thái trên mỗi mũi tên.',
            pool: ERR,
            data: [
                { x: 'Error Active' },
                { v: { b: 'TEC hoặc REC lớn hơn 127' }, x: 'Error Passive' },
                { v: { b: 'TEC lớn hơn 255' }, x: 'Bus-Off' },
                { v: { b: '128 chuỗi 11 bit recessive liên tiếp' }, x: 'Error Active' }
            ],
            explain: 'Node vào Error Passive khi TEC hoặc REC lớn hơn 127, vào Bus-Off khi TEC lớn hơn 255 và quay lại Error Active sau khi thấy 128 chuỗi 11 bit recessive liên tiếp. Node cũng trở về Error Active từ Error Passive khi cả TEC và REC không còn lớn hơn 127. Trong AUTOSAR, việc khởi động lại controller sau bus-off do CanSM điều phối.'
        },

        /* 6. Luồng: truyền dữ liệu dài ISO-TP (kéo thả) */
        {
            type: 'dnd', lesson: 28, kind: 'seq',
            title: 'Lưu đồ truyền một bản tin dài theo ISO 15765-2 giữa bên gửi và bên nhận. Mũi tên cho biết chiều của frame.',
            pool: ['First Frame', 'Flow Control', 'Consecutive Frame', 'Consecutive Frame', 'Single Frame', 'Remote Frame'],
            data: {
                l: 'Bên gửi', r: 'Bên nhận',
                rows: [
                    { d: 'r', x: { b: 'First Frame' } },
                    { d: 'l', x: { b: 'Flow Control' } },
                    { d: 'r', x: { b: 'Consecutive Frame' }, s: 'SN = 1' },
                    { d: 'r', x: { b: 'Consecutive Frame' }, s: 'SN = 2' }
                ]
            },
            explain: 'Bên gửi mở đầu bằng First Frame chứa độ dài tổng, bên nhận trả Flow Control để cho phép gửi tiếp, rồi bên gửi truyền các Consecutive Frame có số thứ tự SN tăng dần. Single Frame chỉ dùng cho dữ liệu ngắn, còn Remote Frame không thuộc ISO 15765-2.'
        },

        /* 7. Luồng: arbitration giữa ba node (danh sách thả xuống) */
        {
            type: 'dd', lesson: 6, kind: 'table',
            title: 'Sơ đồ arbitration giữa ba node cùng bắt đầu gửi frame. Bus hoạt động như phép AND dây, mức 0 là dominant và bit cao nhất của Identifier được gửi trước.',
            pool: [],
            data: {
                rh: true,
                head: ['', 'Bit 1', 'Bit 2', 'Bit 3', 'Bit 4', 'Bit 5', 'Bit 6'],
                rows: [
                    ['Node A', '0', '1', '0', '1', '-', '-'],
                    ['Node B', '0', '1', '0', '0', '1', '1'],
                    ['Node C', '0', '1', '1', '-', '-', '-'],
                    ['Mức bus', '0', '1', { b: '0', o: BIT }, { b: '0', o: BIT }, { b: '1', o: BIT }, '1'],
                    ['Node bị loại', 'Không có', 'Không có', { b: 'Node C', o: WHO }, { b: 'Node A', o: WHO }, 'Không có', 'Không có'],
                    ['Node thắng', { b: 'Node B', o: WHO3, span: 6 }]
                ]
            },
            explain: 'Ở bit 3, Node C gửi 1 nhưng bus là 0 nên Node C thua. Ở bit 4, Node A gửi 1 nhưng bus là 0 nên Node A thua. Chỉ còn Node B gửi nên bus ở bit 5 và bit 6 là 1. Node B thắng vì có Identifier nhỏ nhất.'
        },

        /* 8. Luồng: xử lý bus-off (kéo thả) */
        {
            type: 'dnd', lesson: 27, kind: 'chain',
            title: 'Luồng xử lý bus-off trong AUTOSAR, từ lúc controller phát hiện cho đến khi hoạt động trở lại. Mỗi mũi tên là một lời gọi hàm.',
            pool: ['CanIf_ControllerBusOff', 'CanSM_ControllerBusOff', 'CanIf_SetControllerMode', 'Can_SetControllerMode', 'Com_RxIndication', 'Can_Write', 'EcuM_SetWakeupEvent'],
            data: [
                { x: 'CAN Controller vào trạng thái bus-off' },
                { v: ['Can driver gọi', { b: 'CanIf_ControllerBusOff' }], x: 'CanIf' },
                { v: ['CanIf gọi', { b: 'CanSM_ControllerBusOff' }], x: 'CanSM chờ hết thời gian phục hồi' },
                { v: ['CanSM gọi', { b: 'CanIf_SetControllerMode' }], x: 'CanIf' },
                { v: ['CanIf gọi', { b: 'Can_SetControllerMode' }], x: 'Can driver đưa controller về STARTED' }
            ],
            explain: 'Can driver báo bus-off bằng CanIf_ControllerBusOff, CanIf chuyển tiếp cho CanSM bằng CanSM_ControllerBusOff. Sau thời gian phục hồi đã cấu hình, CanSM gọi CanIf_SetControllerMode và CanIf gọi Can_SetControllerMode để đưa controller về STARTED. Com_RxIndication, Can_Write và EcuM_SetWakeupEvent không nằm trong luồng này.'
        }

    ];
})();