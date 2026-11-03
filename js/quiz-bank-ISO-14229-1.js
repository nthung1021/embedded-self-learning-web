/* Ngân hàng 50 câu hỏi đọc hiểu ISO 14229-1 (UDS, tầng ứng dụng).
   Định dạng theo từng loại câu hỏi:
   mcq   : { type, topic, q, opts: [đáp án ĐÚNG, sai, sai, sai], explain }
   multi : { type, topic, q, ok: [đáp án đúng...], bad: [đáp án sai...], explain }          (tổng 5 lựa chọn)
   tfng  : { type, topic, passage, q, ans: 'T' | 'F' | 'NG', explain }
   dd    : { type, topic, q, text, blanks: { 1: { b, o: [...] }, ... }, explain }          ({n} trong text là ô trống)
   sc    : { type, topic, q, text, ans: [...], pool: [...], explain }                      (kéo thả, pool có mục thừa)
   me    : { type, topic, q, items: [[vế đầu, vế sau], ...], extra: [...], explain }      (kéo thả, extra là vế thừa)
   tc    : { type, topic, q, head: [...], rows: [[ô, ...], ...], pool: [...], explain }    (ô trống là { b }, danh sách thả xuống dùng chung pool)
   sa    : { type, topic, q, items: [[câu hỏi, đáp án], ...], pool: [...], explain }       (danh sách thả xuống dùng chung pool) */
var QUIZ_BANK = [

/* ===== 1. Trắc nghiệm một đáp án (8 câu) ===== */
{ type: 'mcq', topic: 'Phạm vi', q: 'ISO 14229-1 đặc tả các dịch vụ chẩn đoán ở tầng nào của mô hình truyền thông?',
  opts: ['Tầng ứng dụng', 'Tầng liên kết dữ liệu', 'Tầng vận chuyển', 'Tầng vật lý'],
  explain: 'ISO 14229-1 là phần tầng ứng dụng của bộ UDS: nó mô tả các dịch vụ chẩn đoán và định dạng bản tin, không phụ thuộc vào liên kết dữ liệu. Việc truyền trên CAN thuộc ISO 14229-3 và ISO 15765-2.' },
{ type: 'mcq', topic: 'Cấu trúc bản tin', q: 'Dịch vụ WriteDataByIdentifier có SID 0x2E. Byte đầu tiên của phản hồi tích cực tương ứng là gì?',
  opts: ['0x6E', '0x4E', '0x7E', '0xAE'],
  explain: 'Phản hồi tích cực dùng SID bằng SID của yêu cầu cộng 0x40, nên 0x2E + 0x40 = 0x6E. 0x7E là SID phản hồi của TesterPresent.' },
{ type: 'mcq', topic: 'Cấu trúc bản tin', q: 'Một phản hồi tiêu cực của UDS gồm ba byte theo thứ tự nào?',
  opts: ['0x7F, SID của yêu cầu, NRC', 'NRC, SID của yêu cầu, 0x7F', '0x7F, NRC, SID của yêu cầu', 'SID của yêu cầu, 0x7F, NRC'],
  explain: 'Phản hồi tiêu cực bắt đầu bằng 0x7F, theo sau là SID của yêu cầu bị từ chối rồi mã NRC nêu lý do.' },
{ type: 'mcq', topic: 'Sub-function', q: 'Trong byte sub-function, bit nào được dùng làm suppressPosRspMsgIndicationBit?',
  opts: ['Bit 7', 'Bit 0', 'Bit 4', 'Bit 6'],
  explain: 'Bit 7 là suppressPosRspMsgIndicationBit; bảy bit từ bit 6 đến bit 0 chứa giá trị sub-function.' },
{ type: 'mcq', topic: 'Phiên chẩn đoán', q: 'Sub-function nào của dịch vụ DiagnosticSessionControl chọn extendedDiagnosticSession?',
  opts: ['0x03', '0x01', '0x02', '0x04'],
  explain: '0x01 là defaultSession, 0x02 là programmingSession, 0x03 là extendedDiagnosticSession và 0x04 là safetySystemDiagnosticSession.' },
{ type: 'mcq', topic: 'Định thời', q: 'Nếu tester ngừng gửi yêu cầu, bộ định thời nào quyết định thời điểm server tự trở về default session?',
  opts: ['S3server', 'P2server_max', 'P2*server_max', 'S3client'],
  explain: 'S3server là thời gian không hoạt động tối đa của server trong một phiên không phải default. S3client là bộ định thời phía tester dùng để gửi TesterPresent định kỳ.' },
{ type: 'mcq', topic: 'ClearDiagnosticInformation', q: 'Tham số groupOfDTC của dịch vụ 0x14 có giá trị nào khi tester muốn xóa tất cả DTC?',
  opts: ['0xFFFFFF', '0x000000', '0xFF0000', '0x00FFFF'],
  explain: 'groupOfDTC dài 3 byte; 0xFFFFFF chọn mọi DTC, các giá trị khác chọn một DTC hoặc một nhóm DTC cụ thể.' },
{ type: 'mcq', topic: 'Upload/Download', q: 'Dịch vụ nào kết thúc một lần truyền dữ liệu đã bắt đầu bằng RequestDownload?',
  opts: ['0x37', '0x36', '0x38', '0x3E'],
  explain: 'RequestTransferExit (0x37) kết thúc quá trình truyền. 0x36 là TransferData gửi các khối dữ liệu, 0x38 là RequestFileTransfer và 0x3E là TesterPresent.' },

/* ===== 2. Nhiều đáp án (6 câu) ===== */
{ type: 'multi', topic: 'ECUReset', q: 'Giá trị resetType nào của dịch vụ ECUReset được ISO 14229-1 định nghĩa sẵn?',
  ok: ['0x01', '0x03', '0x05'], bad: ['0x00', '0x06'],
  explain: '0x01 là hardReset, 0x03 là softReset và 0x05 là disableRapidPowerShutDown; 0x02 keyOffOnReset và 0x04 enableRapidPowerShutDown cũng là giá trị chuẩn. 0x00 và 0x06 nằm trong dải dự trữ.' },
{ type: 'multi', topic: 'SecurityAccess', q: 'Mã NRC nào có thể xuất hiện trong quá trình mở khóa bằng SecurityAccess?',
  ok: ['0x35', '0x36', '0x37'], bad: ['0x70', '0x73'],
  explain: '0x35 báo key không hợp lệ, 0x36 báo vượt số lần thử cho phép và 0x37 báo chưa hết thời gian trễ bắt buộc. 0x70 và 0x73 thuộc quá trình tải dữ liệu.' },
{ type: 'multi', topic: 'Sub-function', q: 'Dịch vụ nào có byte sub-function nên có thể dùng suppressPosRspMsgIndicationBit?',
  ok: ['0x10', '0x11', '0x3E', '0x85'], bad: ['0x22'],
  explain: '0x10, 0x11, 0x3E và 0x85 đều có byte sub-function. 0x22 dùng DID thay cho sub-function nên không có bit này.' },
{ type: 'multi', topic: 'RoutineControl', q: 'Sub-function nào của dịch vụ RoutineControl được ISO 14229-1 định nghĩa?',
  ok: ['0x01', '0x02', '0x03'], bad: ['0x00', '0x04'],
  explain: '0x01 là startRoutine, 0x02 là stopRoutine và 0x03 là requestRoutineResults. Mỗi routine được xác định bằng routineIdentifier dài 2 byte; yêu cầu sai thứ tự bị từ chối bằng NRC 0x24.' },
{ type: 'multi', topic: 'ReadDTCInformation', q: 'Sub-function nào của dịch vụ 0x19 nhận DTCStatusMask làm tham số của yêu cầu?',
  ok: ['0x01', '0x02'], bad: ['0x03', '0x04', '0x0A'],
  explain: '0x01 (reportNumberOfDTCByStatusMask) và 0x02 (reportDTCByStatusMask) lọc DTC theo status mask. 0x03 và 0x0A không cần tham số, còn 0x04 nhận số DTC cùng số record snapshot.' },
{ type: 'multi', topic: 'Phản hồi đang chờ', q: 'Điều nào đúng khi server gửi phản hồi tiêu cực với NRC 0x78?',
  ok: ['Server đã nhận đúng yêu cầu', 'Server cần thêm thời gian để xử lý', 'Server có thể gửi lại NRC này nhiều lần'],
  bad: ['Server đã hủy bỏ yêu cầu của tester', 'Server yêu cầu tester gửi lại ngay'],
  explain: 'NRC 0x78 (requestCorrectlyReceivedResponsePending) cho biết yêu cầu đã được chấp nhận và phản hồi cuối sẽ đến sau; server có thể lặp lại NRC này để gia hạn. Tester không cần gửi lại yêu cầu.' },

/* ===== 3. Đúng / Sai / Không được đề cập (8 câu) ===== */
{ type: 'tfng', topic: 'Phạm vi',
  passage: 'ISO 14229-1 mô tả các dịch vụ chẩn đoán ở tầng ứng dụng mà không phụ thuộc vào liên kết dữ liệu cụ thể. Tiêu chuẩn cho phép tester điều khiển các chức năng chẩn đoán của ECU, và không quy định cách hiện thực chúng bên trong ECU.',
  q: 'ISO 14229-1 quy định cách hiện thực từng dịch vụ chẩn đoán bên trong ECU.', ans: 'F',
  explain: 'Đoạn tóm lược nêu rõ tiêu chuẩn không quy định cách hiện thực bên trong ECU.' },
{ type: 'tfng', topic: 'Cấu trúc bản tin',
  passage: 'Với mỗi yêu cầu được chấp nhận, server gửi phản hồi tích cực có SID bằng SID của yêu cầu cộng 0x40. Phản hồi tiêu cực dùng SID 0x7F.',
  q: 'Phản hồi tích cực cho yêu cầu ReadDataByIdentifier (0x22) bắt đầu bằng byte 0x62.', ans: 'T',
  explain: '0x22 + 0x40 = 0x62, đúng theo quy tắc trong đoạn tóm lược.' },
{ type: 'tfng', topic: 'Sub-function',
  passage: 'Bit cao nhất của byte sub-function là suppressPosRspMsgIndicationBit. Khi bit này bằng 1, server không gửi phản hồi tích cực. Nếu yêu cầu gặp lỗi, server vẫn gửi phản hồi tiêu cực.',
  q: 'Server vẫn gửi phản hồi tiêu cực cho yêu cầu bị lỗi, kể cả khi suppressPosRspMsgIndicationBit bằng 1.', ans: 'T',
  explain: 'Bit này chỉ chặn phản hồi tích cực; phản hồi tiêu cực vẫn được gửi khi có lỗi.' },
{ type: 'tfng', topic: 'Phiên chẩn đoán',
  passage: 'Khi phản hồi yêu cầu DiagnosticSessionControl, server báo P2server_max theo đơn vị 1 ms và P2*server_max theo đơn vị 10 ms.',
  q: 'Nếu trường P2*server_max trong phản hồi bằng 0x01F4 thì thời gian tối đa tương ứng là 5000 ms.', ans: 'T',
  explain: '0x01F4 bằng 500; 500 × 10 ms = 5000 ms.' },
{ type: 'tfng', topic: 'SecurityAccess',
  passage: 'Trong SecurityAccess, tester dùng sub-function lẻ để yêu cầu seed, sau đó gửi key bằng sub-function chẵn kế tiếp. Key được tính từ seed bằng thuật toán do nhà sản xuất xe hoặc nhà cung cấp quy định.',
  q: 'ISO 14229-1 quy định một thuật toán chung để tính key từ seed.', ans: 'F',
  explain: 'Thuật toán tính key do nhà sản xuất hoặc nhà cung cấp quy định, không do tiêu chuẩn định nghĩa.' },
{ type: 'tfng', topic: 'Kiểu địa chỉ',
  passage: 'Yêu cầu physical được gửi tới một server, còn yêu cầu functional được gửi tới nhiều server cùng lúc. Với yêu cầu functional, server không gửi phản hồi tiêu cực có NRC 0x11, 0x12, 0x31, 0x7E hoặc 0x7F.',
  q: 'Server nhận yêu cầu functional với dịch vụ mà nó không hỗ trợ vẫn phải gửi NRC 0x11.', ans: 'F',
  explain: 'Với yêu cầu functional, server không gửi NRC 0x11 để tránh nhiều server cùng trả lời lỗi.' },
{ type: 'tfng', topic: 'Upload/Download',
  passage: 'Phản hồi tích cực của RequestDownload cho tester biết maxNumberOfBlockLength, tức độ dài tối đa của mỗi khối dữ liệu trong các yêu cầu TransferData sau đó.',
  q: 'Giá trị maxNumberOfBlockLength thường lớn hơn 4095 byte.', ans: 'NG',
  explain: 'Đoạn tóm lược không đề cập đến giá trị thường gặp của maxNumberOfBlockLength.' },
{ type: 'tfng', topic: 'DTC',
  passage: 'Mỗi DTC theo UDS có ba byte mã lỗi và một byte trạng thái. Bit 0 của byte trạng thái là testFailed, bit 3 là confirmedDTC và bit 7 là warningIndicatorRequested.',
  q: 'Byte trạng thái của DTC được server cập nhật mỗi 10 ms.', ans: 'NG',
  explain: 'Đoạn tóm lược không nói gì về tần suất cập nhật byte trạng thái.' },

/* ===== 4. Danh sách thả xuống (6 câu) ===== */
{ type: 'dd', topic: 'Phiên chẩn đoán', q: 'Chọn giá trị đúng cho mỗi chỗ trống.',
  text: 'Dịch vụ {1} dùng để chuyển phiên chẩn đoán của server. Khi chấp nhận yêu cầu, server trả phản hồi tích cực có SID {2}.',
  blanks: { 1: { b: '0x10', o: ['0x10', '0x11', '0x27', '0x3E'] }, 2: { b: '0x50', o: ['0x50', '0x51', '0x67', '0x7E'] } },
  explain: 'DiagnosticSessionControl có SID 0x10, phản hồi tích cực là 0x10 + 0x40 = 0x50. 0x11 là ECUReset, 0x27 là SecurityAccess và 0x3E là TesterPresent.' },
{ type: 'dd', topic: 'ECUReset', q: 'Chọn giá trị đúng cho mỗi chỗ trống.',
  text: 'Để khởi động lại ECU như vừa cấp nguồn, tester dùng dịch vụ {1} với resetType {2}.',
  blanks: { 1: { b: '0x11', o: ['0x10', '0x11', '0x14', '0x28'] }, 2: { b: '0x01', o: ['0x01', '0x02', '0x03', '0x04'] } },
  explain: 'ECUReset có SID 0x11. resetType 0x01 là hardReset mô phỏng việc tắt rồi cấp nguồn lại; 0x02 là keyOffOnReset và 0x03 là softReset.' },
{ type: 'dd', topic: 'ReadDTCInformation', q: 'Chọn giá trị đúng cho mỗi chỗ trống.',
  text: 'Phản hồi tích cực của dịch vụ 0x19 có SID {1}. Sub-function {2} trả về số lượng DTC khớp với status mask.',
  blanks: { 1: { b: '0x59', o: ['0x54', '0x59', '0x62', '0x69'] }, 2: { b: '0x01', o: ['0x01', '0x02', '0x03', '0x04'] } },
  explain: '0x19 + 0x40 = 0x59. Sub-function 0x01 (reportNumberOfDTCByStatusMask) trả số lượng DTC, còn 0x02 trả danh sách DTC.' },
{ type: 'dd', topic: 'SecurityAccess', q: 'Chọn giá trị đúng cho mỗi chỗ trống.',
  text: 'Tester yêu cầu seed bằng sub-function 0x05, nên phải gửi key bằng sub-function {1}. Nếu gửi sai key quá số lần cho phép, server trả NRC {2}.',
  blanks: { 1: { b: '0x06', o: ['0x04', '0x05', '0x06', '0x07'] }, 2: { b: '0x36', o: ['0x24', '0x35', '0x36', '0x37'] } },
  explain: 'Sub-function lẻ yêu cầu seed và sub-function chẵn kế tiếp gửi key, nên 0x05 đi cùng 0x06. NRC 0x35 báo key sai, 0x36 báo vượt số lần thử và 0x37 báo chưa hết thời gian trễ.' },
{ type: 'dd', topic: 'Định thời', q: 'Chọn giá trị đúng cho mỗi chỗ trống.',
  text: 'Khi cần thêm thời gian xử lý, server gửi NRC {1}. Phản hồi kế tiếp phải đến trong thời gian {2}.',
  blanks: { 1: { b: '0x78', o: ['0x10', '0x21', '0x22', '0x78'] }, 2: { b: 'P2*server_max', o: ['P2server_max', 'P2*server_max', 'S3server', 'S3client'] } },
  explain: 'NRC 0x78 là response pending; sau đó thời gian chờ phản hồi tiếp theo là P2*server_max thay cho P2server_max.' },
{ type: 'dd', topic: 'CommunicationControl', q: 'Chọn giá trị đúng cho mỗi chỗ trống.',
  text: 'Dịch vụ {1} cho phép tester bật hoặc tắt việc gửi và nhận một số bản tin của server. Với controlType {2}, server tắt cả việc nhận lẫn việc gửi.',
  blanks: { 1: { b: '0x28', o: ['0x28', '0x2F', '0x85', '0x86'] }, 2: { b: '0x03', o: ['0x00', '0x01', '0x02', '0x03'] } },
  explain: 'CommunicationControl có SID 0x28. controlType 0x00 là enableRxAndTx, 0x01 là enableRxAndDisableTx, 0x02 là disableRxAndEnableTx và 0x03 là disableRxAndTx; phản hồi tích cực là 0x68.' },

/* ===== 5. Điền câu bằng kéo thả (6 câu) ===== */
{ type: 'sc', topic: 'Cấu trúc bản tin', q: 'Kéo các mục thích hợp vào chỗ trống để hoàn thành câu.',
  text: 'Phản hồi tích cực có SID bằng SID của yêu cầu cộng {1}, còn phản hồi tiêu cực luôn bắt đầu bằng byte {2}.',
  ans: ['0x40', '0x7F'], pool: ['0x40', '0x7F', '0x80', '0x7E', '0x50'],
  explain: 'Phản hồi tích cực dùng SID + 0x40 và phản hồi tiêu cực dùng 0x7F. 0x7E là SID phản hồi của TesterPresent và 0x50 là SID phản hồi của DiagnosticSessionControl.' },
{ type: 'sc', topic: 'Phiên chẩn đoán', q: 'Kéo các mục thích hợp vào chỗ trống để hoàn thành câu.',
  text: 'Tại mỗi thời điểm, server chỉ ở đúng một {1}. Nếu không nhận yêu cầu nào trong thời gian {2}, server tự trở về {3}.',
  ans: ['phiên chẩn đoán', 'S3server', 'default session'],
  pool: ['phiên chẩn đoán', 'S3server', 'default session', 'P2server_max', 'mức bảo mật', 'programming session'],
  explain: 'Server luôn ở đúng một phiên chẩn đoán và tự về default session khi S3server hết hạn mà không có yêu cầu nào.' },
{ type: 'sc', topic: 'DTC', q: 'Kéo các mục thích hợp vào chỗ trống để hoàn thành câu.',
  text: 'Mỗi DTC theo UDS gồm {1} byte mã lỗi và {2} byte trạng thái, trong đó bit {3} của byte trạng thái là testFailed.',
  ans: ['3', '1', '0'], pool: ['3', '1', '0', '2', '7'],
  explain: 'DTC dài 3 byte kèm 1 byte trạng thái. Bit 0 là testFailed, còn bit 7 là warningIndicatorRequested.' },
{ type: 'sc', topic: 'Upload/Download', q: 'Kéo các mục thích hợp vào chỗ trống để hoàn thành câu.',
  text: 'Trong addressAndLengthFormatIdentifier, nửa byte cao cho biết số byte của {1} và nửa byte thấp cho biết số byte của {2}.',
  ans: ['memorySize', 'memoryAddress'],
  pool: ['memorySize', 'memoryAddress', 'dataFormatIdentifier', 'blockSequenceCounter', 'maxNumberOfBlockLength'],
  explain: 'Ví dụ giá trị 0x44 nghĩa là cả địa chỉ và kích thước đều dài 4 byte. dataFormatIdentifier nói về nén và mã hóa dữ liệu, không nằm trong byte này.' },
{ type: 'sc', topic: 'ECUReset', q: 'Kéo các mục thích hợp vào chỗ trống để hoàn thành câu.',
  text: 'Khi resetType là 0x04, phản hồi tích cực kèm tham số {1} cho biết thời gian ECU cần để hoàn tất quy trình, tính bằng {2}.',
  ans: ['powerDownTime', 'giây'], pool: ['powerDownTime', 'giây', 'P2server_max', 'mili giây', 'phút'],
  explain: 'powerDownTime dài 1 byte: giá trị 0x00 đến 0xFE là số giây, còn 0xFF cho biết lỗi hoặc không có thông tin.' },
{ type: 'sc', topic: 'Kiểu địa chỉ', q: 'Kéo các mục thích hợp vào chỗ trống để hoàn thành câu.',
  text: 'Yêu cầu gửi tới nhiều server cùng lúc dùng địa chỉ {1}; với yêu cầu này, server không gửi phản hồi tiêu cực có NRC {2}.',
  ans: ['functional', '0x11'], pool: ['functional', 'physical', '0x11', '0x22', '0x78'],
  explain: 'Địa chỉ functional dùng cho yêu cầu một-tới-nhiều; server không trả NRC 0x11 (cũng như 0x12, 0x31, 0x7E, 0x7F) để tránh nhiều phản hồi lỗi cùng lúc.' },

/* ===== 6. Nối vế sau của câu bằng kéo thả (5 câu) ===== */
{ type: 'me', topic: 'Dịch vụ', q: 'Nối phần đầu của mỗi câu với vế sau đúng.',
  items: [
    ['Dịch vụ 0x10 dùng để', 'chuyển sang một phiên chẩn đoán khác'],
    ['Dịch vụ 0x3E dùng để', 'giữ server ở lại phiên hiện tại'],
    ['Dịch vụ 0x14 dùng để', 'xóa DTC và dữ liệu liên quan'],
    ['Dịch vụ 0x85 dùng để', 'bật hoặc tắt việc ghi nhận DTC mới']
  ],
  extra: ['đọc giá trị của một DID', 'mở khóa một cấp bảo mật'],
  explain: '0x10 là DiagnosticSessionControl, 0x3E là TesterPresent, 0x14 là ClearDiagnosticInformation và 0x85 là ControlDTCSetting. Đọc DID là 0x22 và mở khóa là 0x27.' },
{ type: 'me', topic: 'NRC', q: 'Nối phần đầu của mỗi câu với vế sau đúng.',
  items: [
    ['NRC 0x22 báo rằng', 'điều kiện hiện tại của ECU chưa phù hợp'],
    ['NRC 0x31 báo rằng', 'tham số của yêu cầu nằm ngoài phạm vi'],
    ['NRC 0x78 báo rằng', 'server đã nhận yêu cầu và cần thêm thời gian'],
    ['NRC 0x24 báo rằng', 'thứ tự các yêu cầu không như server mong đợi']
  ],
  extra: ['khóa bảo mật gửi lên không hợp lệ', 'dịch vụ không được hỗ trợ trên server'],
  explain: '0x22 là conditionsNotCorrect, 0x31 là requestOutOfRange, 0x78 là response pending và 0x24 là requestSequenceError. Key không hợp lệ là 0x35 và dịch vụ không được hỗ trợ là 0x11.' },
{ type: 'me', topic: 'ECUReset', q: 'Nối phần đầu của mỗi câu với vế sau đúng.',
  items: [
    ['resetType 0x01 là', 'hardReset'],
    ['resetType 0x02 là', 'keyOffOnReset'],
    ['resetType 0x03 là', 'softReset'],
    ['resetType 0x04 là', 'enableRapidPowerShutDown']
  ],
  extra: ['disableRapidPowerShutDown', 'powerCycleReset'],
  explain: 'resetType 0x05 mới là disableRapidPowerShutDown; powerCycleReset không phải giá trị được định nghĩa.' },
{ type: 'me', topic: 'Định thời', q: 'Nối phần đầu của mỗi câu với vế sau đúng.',
  items: [
    ['P2server_max là', 'thời gian tối đa để server gửi phản hồi đầu tiên'],
    ['P2*server_max là', 'thời gian chờ phản hồi sau khi server gửi NRC 0x78'],
    ['S3server là', 'thời gian không nhận yêu cầu trước khi server về default session'],
    ['S3client là', 'chu kỳ tester gửi yêu cầu giữ phiên']
  ],
  extra: ['thời gian tối đa ECU cần để khởi động lại', 'thời gian bị khóa sau khi gửi sai key'],
  explain: 'Bốn bộ định thời này điều khiển nhịp trao đổi giữa tester và server; thời gian khởi động lại và thời gian khóa key không phải các bộ định thời đó.' },
{ type: 'me', topic: 'Nhóm dịch vụ', q: 'Nối phần đầu của mỗi câu với vế sau đúng.',
  items: [
    ['Dịch vụ 0x19 thuộc nhóm', 'Stored Data Transmission'],
    ['Dịch vụ 0x2F thuộc nhóm', 'Input Output Control'],
    ['Dịch vụ 0x31 thuộc nhóm', 'Remote Activation of Routine'],
    ['Dịch vụ 0x36 thuộc nhóm', 'Upload Download']
  ],
  extra: ['Data Transmission', 'Diagnostic and Communication Management'],
  explain: 'ISO 14229-1 chia dịch vụ thành các nhóm chức năng. 0x22 thuộc Data Transmission còn 0x10 thuộc Diagnostic and Communication Management.' },

/* ===== 7. Điền bảng bằng danh sách thả xuống (5 câu) ===== */
{ type: 'tc', topic: 'SID phản hồi', q: 'Hoàn thành bảng SID yêu cầu và SID phản hồi tích cực của từng dịch vụ.',
  head: ['Dịch vụ', 'SID yêu cầu', 'SID phản hồi tích cực'],
  rows: [
    ['DiagnosticSessionControl', '0x10', { b: '0x50' }],
    ['ReadDataByIdentifier', '0x22', { b: '0x62' }],
    ['RoutineControl', '0x31', { b: '0x71' }],
    ['RequestDownload', '0x34', { b: '0x74' }],
    ['ControlDTCSetting', '0x85', { b: '0xC5' }]
  ],
  pool: ['0x50', '0x62', '0x71', '0x74', '0xC5', '0x6E', '0x7E'],
  explain: 'SID phản hồi bằng SID yêu cầu cộng 0x40. 0x6E là phản hồi của WriteDataByIdentifier và 0x7E là phản hồi của TesterPresent nên không có trong bảng.' },
{ type: 'tc', topic: 'Phiên chẩn đoán', q: 'Hoàn thành bảng giá trị sub-function của dịch vụ DiagnosticSessionControl.',
  head: ['Sub-function', 'Phiên chẩn đoán'],
  rows: [
    ['0x01', { b: 'defaultSession' }],
    ['0x02', { b: 'programmingSession' }],
    ['0x03', { b: 'extendedDiagnosticSession' }],
    ['0x04', { b: 'safetySystemDiagnosticSession' }]
  ],
  pool: ['defaultSession', 'programmingSession', 'extendedDiagnosticSession', 'safetySystemDiagnosticSession', 'securitySession', 'debugSession'],
  explain: 'ISO 14229-1 định nghĩa bốn phiên chuẩn; securitySession và debugSession không phải phiên được định nghĩa.' },
{ type: 'tc', topic: 'NRC', q: 'Hoàn thành bảng tên ứng với từng mã NRC.',
  head: ['NRC', 'Tên mã'],
  rows: [
    ['0x13', { b: 'incorrectMessageLengthOrInvalidFormat' }],
    ['0x21', { b: 'busyRepeatRequest' }],
    ['0x33', { b: 'securityAccessDenied' }],
    ['0x73', { b: 'wrongBlockSequenceCounter' }],
    ['0x7E', { b: 'subFunctionNotSupportedInActiveSession' }]
  ],
  pool: ['incorrectMessageLengthOrInvalidFormat', 'busyRepeatRequest', 'securityAccessDenied', 'wrongBlockSequenceCounter',
         'subFunctionNotSupportedInActiveSession', 'requestSequenceError', 'generalReject', 'conditionsNotCorrect'],
  explain: 'requestSequenceError là 0x24, generalReject là 0x10 và conditionsNotCorrect là 0x22.' },
{ type: 'tc', topic: 'DTC', q: 'Hoàn thành bảng các bit của DTC status byte.',
  head: ['Bit', 'Tên bit'],
  rows: [
    ['Bit 0', 'testFailed'],
    ['Bit 1', { b: 'testFailedThisOperationCycle' }],
    ['Bit 2', { b: 'pendingDTC' }],
    ['Bit 3', 'confirmedDTC'],
    ['Bit 5', { b: 'testFailedSinceLastClear' }],
    ['Bit 6', { b: 'testNotCompletedThisOperationCycle' }]
  ],
  pool: ['testFailedThisOperationCycle', 'pendingDTC', 'testFailedSinceLastClear', 'testNotCompletedThisOperationCycle',
         'testNotCompletedSinceLastClear', 'warningIndicatorRequested'],
  explain: 'testNotCompletedSinceLastClear là bit 4 và warningIndicatorRequested là bit 7, cả hai nằm ngoài các dòng được hỏi.' },
{ type: 'tc', topic: 'InputOutputControl', q: 'Hoàn thành bảng giá trị inputOutputControlParameter của dịch vụ InputOutputControlByIdentifier.',
  head: ['Giá trị', 'Ý nghĩa'],
  rows: [
    ['0x00', { b: 'returnControlToECU' }],
    ['0x01', { b: 'resetToDefault' }],
    ['0x02', { b: 'freezeCurrentState' }],
    ['0x03', { b: 'shortTermAdjustment' }]
  ],
  pool: ['returnControlToECU', 'resetToDefault', 'freezeCurrentState', 'shortTermAdjustment', 'hardReset', 'startRoutine'],
  explain: 'hardReset thuộc dịch vụ ECUReset và startRoutine thuộc dịch vụ RoutineControl.' },

/* ===== 8. Trả lời ngắn bằng danh sách thả xuống (6 câu) ===== */
{ type: 'sa', topic: 'SID', q: 'Chọn SID cho mỗi câu hỏi.',
  items: [
    ['SID của dịch vụ đọc dữ liệu theo DID là gì?', '0x22'],
    ['SID của dịch vụ ghi dữ liệu theo DID là gì?', '0x2E'],
    ['SID của dịch vụ điều khiển routine là gì?', '0x31'],
    ['SID của dịch vụ mở khóa bảo mật là gì?', '0x27']
  ],
  pool: ['0x22', '0x2E', '0x31', '0x27', '0x2F', '0x3E', '0x23'],
  explain: '0x22 là ReadDataByIdentifier, 0x2E là WriteDataByIdentifier, 0x31 là RoutineControl và 0x27 là SecurityAccess. 0x2F là InputOutputControlByIdentifier, 0x3E là TesterPresent và 0x23 là ReadMemoryByAddress.' },
{ type: 'sa', topic: 'Kích thước trường', q: 'Chọn giá trị đúng cho mỗi câu hỏi.',
  items: [
    ['Một DID dài bao nhiêu?', '2 byte'],
    ['groupOfDTC của dịch vụ 0x14 dài bao nhiêu?', '3 byte'],
    ['Một byte sub-function có bao nhiêu bit?', '8 bit'],
    ['Giá trị sub-function chiếm bao nhiêu bit trong byte đó?', '7 bit']
  ],
  pool: ['2 byte', '3 byte', '8 bit', '7 bit', '4 byte', '16 bit', '5 bit'],
  explain: 'DID dài 2 byte, groupOfDTC dài 3 byte. Byte sub-function có 8 bit, trong đó bit 7 là suppressPosRspMsgIndicationBit nên còn 7 bit cho giá trị sub-function.' },
{ type: 'sa', topic: 'Định thời', q: 'Chọn giá trị mặc định cho mỗi bộ định thời.',
  items: [
    ['Giá trị mặc định của P2server_max là bao nhiêu?', '50 ms'],
    ['Giá trị mặc định của S3server là bao nhiêu?', '5000 ms'],
    ['Giá trị mặc định của S3client là bao nhiêu?', '2000 ms']
  ],
  pool: ['50 ms', '5000 ms', '2000 ms', '500 ms', '100 ms', '10 ms'],
  explain: 'Theo các tài liệu mô tả ISO 14229-1, P2server_max mặc định là 50 ms, S3server là 5000 ms và S3client là 2000 ms; S3client phải nhỏ hơn S3server để tester kịp giữ phiên.' },
{ type: 'sa', topic: 'Upload/Download', q: 'Chọn SID cho mỗi câu hỏi.',
  items: [
    ['Dịch vụ nào báo địa chỉ và kích thước vùng nhớ để ghi vào ECU?', '0x34'],
    ['Dịch vụ nào khởi tạo việc tải dữ liệu từ ECU lên tester?', '0x35'],
    ['Dịch vụ nào gửi từng khối dữ liệu?', '0x36'],
    ['Dịch vụ nào kết thúc quá trình truyền?', '0x37']
  ],
  pool: ['0x34', '0x35', '0x36', '0x37', '0x38', '0x3D', '0x23'],
  explain: '0x34 là RequestDownload, 0x35 là RequestUpload, 0x36 là TransferData và 0x37 là RequestTransferExit. 0x38 là RequestFileTransfer, 0x3D là WriteMemoryByAddress và 0x23 là ReadMemoryByAddress.' },
{ type: 'sa', topic: 'NRC', q: 'Chọn mã NRC cho mỗi tình huống.',
  items: [
    ['NRC khi key SecurityAccess không hợp lệ là gì?', '0x35'],
    ['NRC khi số lần gửi key sai vượt giới hạn là gì?', '0x36'],
    ['NRC khi tester thử lại key trước khi hết thời gian trễ bắt buộc là gì?', '0x37'],
    ['NRC khi server đã nhận yêu cầu và cần thêm thời gian là gì?', '0x78']
  ],
  pool: ['0x35', '0x36', '0x37', '0x78', '0x33', '0x24', '0x21'],
  explain: '0x35 là invalidKey, 0x36 là exceededNumberOfAttempts, 0x37 là requiredTimeDelayNotExpired và 0x78 là response pending. 0x33 là securityAccessDenied, 0x24 là requestSequenceError và 0x21 là busyRepeatRequest.' },
{ type: 'sa', topic: 'Dịch vụ theo ISO 14229-1:2020', q: 'Theo ISO 14229-1:2020, chọn tên dịch vụ ứng với mỗi SID.',
  items: [
    ['Dịch vụ 0x28 có tên là gì?', 'CommunicationControl'],
    ['Dịch vụ 0x29 có tên là gì?', 'Authentication'],
    ['Dịch vụ 0x2A có tên là gì?', 'ReadDataByPeriodicIdentifier'],
    ['Dịch vụ 0x2C có tên là gì?', 'DynamicallyDefineDataIdentifier']
  ],
  pool: ['CommunicationControl', 'Authentication', 'ReadDataByPeriodicIdentifier', 'DynamicallyDefineDataIdentifier',
         'AccessTimingParameter', 'ResponseOnEvent', 'LinkControl'],
  explain: 'Dịch vụ Authentication (0x29) được thêm ở bản 2020, còn AccessTimingParameter (0x83) bị rút khỏi bản này. ResponseOnEvent là 0x86 và LinkControl là 0x87.' }

];