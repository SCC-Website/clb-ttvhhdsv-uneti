(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = 'scc-diary-leaderboard-v1';
  const days = [
    { title:'Khởi đầu mới – Tìm hiểu về CLB', label:'KHỞI ĐẦU', icon:'✦', story:'Ngày đầu tiên của bạn ở SCC đã đến. Khoác chiếc áo 5S, làm quen với các thành viên mới và khám phá tinh thần Văn hoá học đường.', ending:'Ngày đầu tiên khép lại với những điều mới mẻ. Bạn đã hiểu hơn về SCC — ngày mai sẽ có nhiệm vụ đầu tiên!', tasks:[
      quiz('Tên đầy đủ của CLB SCC là gì?',['CLB Tuyên truyền Văn hoá học đường Sinh viên','Câu lạc bộ Sinh viên Chia sẻ','CLB Sáng tạo Công nghệ','Câu lạc bộ Sự kiện Sinh viên'],0),
      quiz('Sinh nhật CLB SCC chính xác vào ngày nào?',['20/11','25/02','26/03','02/09'],1),
      quiz('Chiếc áo đặc trưng của thành viên SCC là gì?',['Áo xanh tình nguyện','Áo trắng đỏ 5S UNETI','Áo sơ mi đen','Áo thể dục'],1)
    ]},
    { title:'Hoạt động đầu tiên – Nhiệm vụ ca trực trong trường', label:'BẮT NHỊP', icon:'☀', story:'Sáng nay bạn nhận nhiệm vụ đầu tiên. Hãy chọn ca trực phù hợp, đến đúng điểm hẹn và cùng giữ gìn nề nếp trong trường.', ending:'Ca trực đã hoàn thành! Một lời chào thân thiện và sự có mặt đúng lúc đã giúp buổi học bắt đầu thật suôn sẻ.', tasks:[
      quiz('Hôm nay bạn chọn trường hợp nào?',['Trực đầu giờ','Trực bộ phận hành chính 1 cửa'],0,{kind:'branch'}),
      place('Bạn có lịch trực đầu giờ tại Cổng vào (Minh Khai). Hãy chọn đúng điểm hoàn thành nhiệm vụ.','Minh Khai','Cổng vào'),
      quiz('Nếu đăng kí trực buổi sáng, bạn cần có mặt lúc mấy giờ?',['6h00','6h40','7h00','7h15'],1),
      quiz('Nhiệm vụ chính tại điểm trực đầu giờ là gì?',['Giữ gìn trật tự, giúp sinh viên thực hiện văn hoá học đường','Chỉ đứng chờ hết ca','Nhắc nhở mọi người thật to','Tự ý xử lý mọi tình huống'],0),
      quiz('Nếu thấy chen lấn, xô đẩy hoặc mâu thuẫn, bạn nên làm gì?',['Cố gắng ngăn chặn an toàn và báo người có trách nhiệm nếu cần','Quay video đăng mạng','Bỏ đi ngay','Tranh cãi với các bạn'],0)
    ]},
    { title:'Lan toả văn hoá học đường', label:'LAN TOẢ', icon:'♡', story:'Hôm nay bạn cùng đội SCC đến các lớp và khu thực hành. Hãy nhắc nhở bằng sự tôn trọng, để nét đẹp học đường được lan toả tự nhiên.', ending:'Đội tuyên truyền đã hoàn thành hành trình. Mỗi hành động văn minh bạn ghi nhận hôm nay sẽ góp phần làm trường học tốt đẹp hơn.', tasks:[
      place('Bạn tập trung tại Phòng Chính trị & Công tác Sinh viên ở cơ sở Minh Khai để nhận nhiệm vụ. Chọn đúng vị trí nhé.','Minh Khai','Phòng Chính trị & Công tác Sinh viên – toà HA3'),
      place('Đội tuyên truyền sẽ đến Các phòng học tại cơ sở Minh Khai. Hãy chọn nơi hoàn thành nhiệm vụ.','Minh Khai','Các phòng học'),
      quiz('Nếu đi tuyên truyền và kiểm tra vào buổi sáng, bạn cần có mặt lúc nào?',['7h30','8h00','8h15','9h00'],2),
      quiz('Khi đi cùng đội tuyên truyền và kiểm tra, bạn nên làm gì?',['Giữ trật tự, tuân thủ nguyên tắc văn hoá học đường','Tự ý tách đoàn','Nói chuyện riêng trong lớp','Nhắc nhở thật gay gắt'],0),
      quiz('Phát hiện sinh viên không đeo thẻ, bạn nên làm gì?',['Ghi nhận và báo Thầy/Cô đầu mối','Chụp ảnh đăng lên mạng','Bỏ qua mọi trường hợp','Giữ thẻ của bạn ấy'],0),
      quiz('Thấy sinh viên vứt rác bừa bãi, mặc kệ là đúng hay sai?',['Đúng','Sai'],1)
    ]},
    { title:'Cùng nhau lên kế hoạch', label:'ĐỒNG HÀNH', icon:'✎', story:'Cuộc họp CLB bắt đầu đúng giờ. Mỗi ý kiến đều góp thêm một góc nhìn — hãy lắng nghe, chia sẻ và cùng nhau lên kế hoạch.', ending:'Buổi họp kết thúc trong tinh thần đồng đội. Một kế hoạch tốt được tạo nên khi mọi thành viên cùng lắng nghe và đóng góp.', tasks:[
      place('CLB họp tại Phòng hội thảo – toà HH1, cơ sở Minh Khai. Bạn hãy chọn đúng địa điểm.','Minh Khai','Phòng hội thảo – toà HH1'),
      quiz('Khi bất đồng ý kiến trong buổi sinh hoạt CLB, cách ứng xử tốt nhất là gì?',['Lắng nghe, trao đổi tôn trọng và cùng tìm giải pháp','Ngắt lời để bảo vệ ý mình','Tranh cãi đến cùng','Im lặng rồi nói xấu sau lưng'],0),
      quiz('Khi được góp ý về nhiệm vụ trong CLB, bạn nên làm gì?',['Lắng nghe, tiếp thu và điều chỉnh phù hợp','Tự ái và bỏ việc giữa chừng','Tranh luận để chứng minh mình luôn đúng','Đổ lỗi cho thành viên khác'],0),
      quiz('Nếu vô tình làm ảnh hưởng đến công việc chung, bạn nên làm gì?',['Chủ động nhận trách nhiệm và phối hợp khắc phục','Im lặng chờ người khác giải quyết','Xoá tin nhắn để tránh bị phát hiện','Đổ lỗi cho người đến sau'],0)
    ]},
    { title:'Có mặt khi cần bạn', label:'SẺ CHIA', icon:'✿', story:'Sự kiện và hội thảo đang cần thêm những cánh tay hỗ trợ. Bạn có mặt đúng nơi, đúng lúc — một thành viên đáng tin cậy luôn bắt đầu từ những việc nhỏ.', ending:'Sự kiện đã diễn ra tốt đẹp nhờ sự phối hợp của mọi người. Cảm ơn bạn đã có mặt và hỗ trợ đến cùng!', tasks:[
      place('Nghe tin sự kiện cần hỗ trợ ở Phòng hội thảo – toà HH1, cơ sở Minh Khai. Hãy chọn đúng vị trí.','Minh Khai','Phòng hội thảo – toà HH1'),
      quiz('Khi đi hỗ trợ sự kiện, trang phục phù hợp là gì?',['Áo 5S, quần lịch sự, giày hoặc sandal và đeo thẻ sinh viên','Trang phục tuỳ ý, không cần thẻ','Đồng phục thể thao và dép lê','Chỉ cần áo khoác CLB'],0),
      quiz('Điều quan trọng nhất khi thực hiện nhiệm vụ hỗ trợ là gì?',['Làm theo hướng dẫn của Thầy/Cô, Cán bộ và đầu mối CLB','Tự đổi nhiệm vụ theo ý mình','Chỉ hỗ trợ việc mình thích','Để người khác phân công lại nhiều lần'],0),
      quiz('Điều nào không nên làm khi đi hỗ trợ?',['Bỏ về giữa chừng khi vẫn còn công việc','Hỏi đầu mối khi chưa rõ việc','Phối hợp với các thành viên','Có mặt đúng giờ'],0)
    ]},
    { title:'Gắn kết thành một đội', label:'GẮN KẾT', icon:'☼', story:'Sau những ngày bận rộn, cả CLB dành thời gian gặp gỡ và sẻ chia. Tinh thần đồng đội cũng được nuôi dưỡng từ những khoảnh khắc vui vẻ bên nhau.', ending:'Một ngày tràn tiếng cười khép lại. Những kết nối hôm nay sẽ giúp đội SCC đồng hành với nhau lâu hơn.', tasks:[
      quiz('Nghe tin hôm nay CLB họp có quà, phản ứng nào vui nhất?',['Giả vờ không quan tâm nhưng hóng tin rất kỹ','Bình thường thôi, có gì đâu','Xin nghỉ vì cảm thấy ngại','Thôi xủi một hôm vậy'],0),
      quiz('Nghe tin CLB chuẩn bị đi picnic, bạn sẽ…',['Đóng tiền và lên xe!','Ở nhà chờ ảnh','Để mọi người đi trước','Quên mất lịch hẹn'],0)
    ]},
    { title:'Điều bạn muốn giữ lại', label:'TRƯỞNG THÀNH', icon:'❀', story:'Một tuần khép lại, nhưng hành trình xây dựng văn hoá học đường vẫn tiếp tục. Hãy mang theo những điều tốt đẹp bạn đã cùng SCC tạo nên.', ending:'Cảm ơn bạn đã viết nên tuần trải nghiệm này. Văn hoá học đường đẹp lên từ những lựa chọn nhỏ bạn mang theo mỗi ngày.', tasks:[
      quiz('Những lần sau, bạn sẽ thực hiện tốt nét đẹp Văn hoá học đường sinh viên chứ?',['Có nha!','Không…'],0),
      quiz('Nếu SCC mở đợt tuyển thành viên mới, bạn sẽ…',['Mời mọi người cùng tham gia!','Giữ thông tin cho riêng mình','Khuyên mọi người đừng đăng kí','Chờ người khác hỏi mới kể'],0)
    ]}
  ];
  const mkPlaces=['Cổng vào','Phòng hội thảo – toà HH1','Các phòng học','Phòng thực hành nghiệp vụ kế toán','Phòng thực hành Khách sạn','Các phòng học chất lượng','Phòng Chính trị & Công tác Sinh viên – toà HA3'];
  const lnPlaces=['Cổng vào C1','Cổng vào C2','Phòng hội thảo – toà HA8','Phòng Chính trị & Công tác Sinh viên – toà HA8','Phòng thực hành cơ khí – toà HA9','Các phòng học','Phòng thực hành CNTT – toà HA9','Phòng thực hành Điện – Tự động hoá – toà HA10','Phòng thực hành Công nghệ thực phẩm – toà HA10','Phòng thực hành Điện tử – Kỹ thuật Máy tính – toà HA10','Sảnh Truyền thống','Văn phòng Đoàn – toà HA11','Thang máy – toà HA10','Thang máy – toà HA11','Cầu nối giữa toà HA9 và HA11','Hội trường lớn'];
  const branchTemplate=days[1].tasks[0];
  const day1QuestionBank=[
    quiz('Tên đầy đủ của CLB SCC là gì?',['CLB Tuyên truyền Văn hoá học đường Sinh viên','Câu lạc bộ Sinh viên Chia sẻ','CLB Sáng tạo Công nghệ','Câu lạc bộ Sự kiện Sinh viên'],0),
    quiz('CLB SCC được thành lập năm nào?',['2023','2022','2024','2021'],0),
    quiz('Sinh nhật CLB SCC chính xác vào ngày nào?',['20/11','25/02','26/03','02/09'],1),
    quiz('Chiếc áo đặc trưng cho CLB SCC là gì?',['Áo trắng đỏ 5S UNETI','Áo xanh tình nguyện','Áo sơ mi đen','Áo thể dục'],0),
    quiz('CLB SCC trực thuộc tổ chức nào của trường?',['Đoàn TNCS Hồ Chí Minh','Khoa Giáo dục Thể chất','Phòng Tuyển sinh & Truyền thông','Trung tâm Thư viện'],0),
    quiz('Thường xuyên đeo thẻ sinh viên chủ yếu để làm gì?',['Phân biệt sinh viên, thực hiện các thủ tục trong trường','Trang trí đồng phục','Thay thế giấy tờ tuỳ thân trong mọi trường hợp','Chỉ để điểm danh ở lớp'],0),
    quiz('Có bao nhiêu nguyên tắc vàng của sinh viên khi thực hiện Văn hoá học đường?',['5','6','8','10'],2),
    quiz('Hoàn thiện nội quy: “_____ hút thuốc lá.”',['Không','Có','Chỉ hút ngoài lớp','Tuỳ từng ngày'],0),
    quiz('Số lượng thành viên CLB SCC là bao nhiêu?',['300+','50+','150+','200+'],0),
    quiz('Sắp xếp đúng thứ tự các thế hệ:',['Gen 4.1 → Gen 4.2 → Gen 5','Gen 5 → Gen 4.1 → Gen 4.2','Gen 4.2 → Gen 5 → Gen 4.1','Gen 4.1 → Gen 5 → Gen 4.2'],0),
    quiz('Điền từ còn thiếu trong tên Trường Đại học Kinh tế - Kỹ thuật ____ ____?',['Công nghiệp','Thương mại','Công nghệ','Tài chính'],0),
    quiz('Hoàn thiện tên tiếng Anh: School ______ Club.',['Culture','Culture Day','Cultural','Campus'],0),
    quiz('Hoàn thiện slogan: “Thân thiện - Chuyên nghiệp - Đồng hành và ______ ___”.',['Chia sẻ','Phát triển','Thành công','Kết nối'],0),
    quiz('Ai là Chủ nhiệm của CLB SCC?',['Trần Thế Phú','Dương Thị Kim Anh','Vũ Thị Thu','Vũ Quang Việt'],0),
    quiz('Sắp xếp tên Phó Chủ nhiệm, Trưởng ban Nhân sự & Tài chính – Hậu cần:',['Dương Thị Kim Anh','Kim Anh Dương Thị','Thị Dương Kim Anh','Anh Dương Thị Kim'],0),
    quiz('Nhiệm vụ chính của ban Truyền thông – Kỹ thuật – Sự kiện sinh viên là gì?',['Thực hiện các mảng design, media, hỗ trợ kỹ thuật và sự kiện trong CLB và nhà trường','Chỉ quản lý điểm danh thành viên','Chỉ tổ chức hoạt động thể thao','Chỉ viết biên bản họp'],0),
    quiz('Đâu là biểu hiện của văn hoá xếp hàng?',['Giữ đúng thứ tự và nhường người cần ưu tiên','Chen lên trước vì đang vội','Nhờ bạn giữ chỗ cho cả nhóm đông','Đứng chắn lối đi'],0),
    quiz('Ban nào rất phù hợp dành cho Đảng viên?',['Ban Phát triển Đảng viên','Ban Văn nghệ','Ban Hậu cần sự kiện','Ban Truyền thông'],0),
    quiz('CLB SCC hoạt động ở cơ sở nào?',['Cơ sở Minh Khai, P. Vĩnh Tuy, Hà Nội','Cơ sở Lĩnh Nam, P. Hoàng Mai, Hà Nội','Cơ sở Trần Hưng Đạo, P. Nam Định, Ninh Bình','Cả 3 cơ sở trên'],3),
    quiz('Thấy một bạn bị trêu chọc, chế giễu trong lớp, bạn nên làm gì?',['Bình tĩnh hỗ trợ bạn và báo người có trách nhiệm nếu cần','Ra hùa theo cho vui','Quay video rồi đăng lên mạng xã hội','Mặc kệ hoàn toàn và rời khỏi hiện trường'],0),
    quiz('Danh hiệu nào hợp với người luôn có mặt đầu tiên và hỗ trợ nhiệt tình ở mọi sự kiện SCC?',['Chiến thần hỗ trợ','Bậc thầy mất tích','Chuyên gia xin về sớm','Đại sứ ngủ nướng'],0),
    quiz('Mỗi năm học CLB SCC mở đơn tuyển thành viên bao nhiêu lần?',['2','1','3','4'],0),
    quiz('Ban nào có nhiệm vụ chính là quản lý nhân sự, hỗ trợ?',['Nhân sự','Tài chính - Hậu cần','Tuyên truyền và thực hiện VHHD','Thông tin - Kết nối sinh viên'],0),
    quiz('Ban nào có nhiệm vụ chính là khảo sát, ghi nhận ý kiến về văn hoá học đường và mở rộng liên kết với các sinh viên trong trường?',['Nhân sự','Truyền thông - Kỹ thuật - Sự kiện','Tuyên truyền và thực hiện VHHD','Thông tin - Kết nối sinh viên'],3)
  ];
  const day2DirectLocations=[{campus:'Minh Khai',target:'Cổng vào'},{campus:'Lĩnh Nam',target:'Cổng vào C1'},{campus:'Lĩnh Nam',target:'Cổng vào C2'},{campus:'Lĩnh Nam',target:'Cầu nối giữa toà HA9 và HA11'},{campus:'Lĩnh Nam',target:'Thang máy – toà HA10'}];
  const day2DirectQuestionBank=[
    quiz('Khi bạn đăng kí trực buổi sáng, bạn cần có mặt lúc mấy giờ?',['6h40','6h00','7h00','7h15'],0),
    quiz('Khi bạn đăng kí trực buổi chiều, bạn cần có mặt lúc mấy giờ?',['11h40','11h00','12h00','13h00'],0),
    quiz('Khi có mặt tại điểm trực đầu giờ, nhiệm vụ chính của bạn là gì?',['Giữ gìn trật tự, giúp các bạn thực hiện văn hoá học đường sinh viên','Chỉ đứng chờ hết ca','Tự ý xử lý mọi tình huống','Nhắc nhở mọi người thật to'],0),
    quiz('Khi thấy chen lấn, xô đẩy hoặc mâu thuẫn ở điểm trực, bạn sẽ làm gì?',['Cố gắng ngăn chặn và báo người có trách nhiệm nếu cần','Quay video đăng lên mạng','Bỏ đi ngay','Tranh cãi với các bạn'],0),
    quiz('Bạn có cần thành viên khác cùng tham gia trực đầu giờ không?',['Có','Không'],0)
  ];
  const day2AdminLocations=[{campus:'Minh Khai',target:'Phòng Chính trị & Công tác Sinh viên – toà HA3'},{campus:'Lĩnh Nam',target:'Phòng Chính trị & Công tác Sinh viên – toà HA8'}];
  const day2AdminQuestionBank=[quiz('Khi trực bộ phận hành chính 1 cửa, bạn có nên giữ trật tự không?',['Có','Không'],0),quiz('Khi Thầy/Cô phòng Chính trị & Công tác Sinh viên nhờ bạn giúp đỡ, bạn có sẵn lòng giúp đỡ không?',['Có','Không'],0)];
  const day3OfficeLocations=[...day2AdminLocations];
  const day3ClassroomLocations=[
    {campus:'Minh Khai',target:'Các phòng học'},{campus:'Minh Khai',target:'Phòng thực hành nghiệp vụ kế toán'},{campus:'Minh Khai',target:'Phòng thực hành Khách sạn'},{campus:'Minh Khai',target:'Các phòng học chất lượng'},
    {campus:'Lĩnh Nam',target:'Phòng thực hành cơ khí – toà HA9'},{campus:'Lĩnh Nam',target:'Các phòng học'},{campus:'Lĩnh Nam',target:'Phòng thực hành CNTT – toà HA9'},{campus:'Lĩnh Nam',target:'Phòng thực hành Điện – Tự động hoá – toà HA10'},{campus:'Lĩnh Nam',target:'Phòng thực hành Công nghệ thực phẩm – toà HA10'},{campus:'Lĩnh Nam',target:'Phòng thực hành Điện tử – Kỹ thuật Máy tính – toà HA10'}
  ];
  const day3QuestionBank=[
    quiz('Khi đi tuyên truyền và kiểm tra Văn hoá học đường vào buổi sáng, bạn cần có mặt lúc mấy giờ?',['8h15','7h30','8h00','9h00'],0),
    quiz('Khi đi tuyên truyền và kiểm tra Văn hoá học đường vào buổi chiều, bạn cần có mặt lúc mấy giờ?',['14h15','13h30','14h00','15h00'],0),
    quiz('Khi theo đội tuyên truyền và kiểm tra, bạn nên như thế nào?',['Giữ trật tự, tuân thủ nguyên tắc văn hoá học đường','Tự ý tách đoàn','Nói chuyện riêng trong lớp','Nhắc nhở thật gay gắt'],0),
    quiz('Khi phát hiện sinh viên không đeo thẻ sinh viên, bạn sẽ làm gì?',['Ghi tên sinh viên vi phạm và báo cho Thầy/Cô đầu mối','Chụp ảnh đăng lên mạng xã hội','Bỏ qua mọi trường hợp','Giữ thẻ của bạn ấy'],0),
    quiz('Thấy sinh viên vứt rác bừa bãi mà bạn mặc kệ, đúng hay sai?',['Đúng','Sai'],1),
    quiz('Tất cả các CLB trong trường có thể tham gia buổi tuyên truyền và kiểm tra Văn hoá học đường đúng không?',['Đúng','Sai'],0)
  ];
  const day4MeetingLocations=[{campus:'Minh Khai',target:'Phòng Chính trị & Công tác Sinh viên – toà HA3'},{campus:'Minh Khai',target:'Phòng hội thảo – toà HH1'},{campus:'Lĩnh Nam',target:'Phòng Chính trị & Công tác Sinh viên – toà HA8'},{campus:'Lĩnh Nam',target:'Phòng hội thảo – toà HA8'}];
  const day4QuestionBank=[
    quiz('Khi bất đồng ý kiến trong buổi sinh hoạt CLB, cách ứng xử tốt nhất là gì?',['Lắng nghe, trao đổi tôn trọng và cùng tìm giải pháp','Cố ý ngắt lời người khác và biện minh không có lý do','Tiếp tục tranh cãi đến cùng','Im lặng rồi nói xấu sau lưng'],0),
    quiz('Khi được góp ý về nhiệm vụ trong CLB, bạn nên làm gì?',['Lắng nghe, tiếp thu và điều chỉnh phù hợp','Tự ái và bỏ việc giữa chừng','Tranh luận để chứng minh mình luôn đúng','Đổ lỗi cho các thành viên khác'],0),
    quiz('Nếu vô tình làm ảnh hưởng đến công việc chung, bạn nên làm gì?',['Tôn trọng mọi người, trao đổi rõ ràng và đúng mục đích','Nhắn tin xúc phạm khi tức giận, tự ái','Chia sẻ tin lên mạng xã hội khi chưa kiểm chứng','Spam tin nhắn liên tục với nhiều nhóm và người khác'],0),
    quiz('Nếu vô tình làm ảnh hưởng đến công việc chung, bạn nên làm gì?',['Chủ động nhận trách nhiệm và phối hợp khắc phục','Im lặng và chờ người khác giải quyết','Nhanh chóng xoá tin nhắn để tránh bị phát hiện','Đổ lỗi cho người đến sau'],0)
  ];
  const day5EventLocations=[
    {campus:'Minh Khai',target:'Cổng vào'},{campus:'Minh Khai',target:'Phòng hội thảo – toà HH1'},{campus:'Minh Khai',target:'Phòng Chính trị & Công tác Sinh viên – toà HA3'},
    {campus:'Lĩnh Nam',target:'Cổng vào C1'},{campus:'Lĩnh Nam',target:'Cổng vào C2'},{campus:'Lĩnh Nam',target:'Phòng hội thảo – toà HA8'},{campus:'Lĩnh Nam',target:'Phòng Chính trị & Công tác Sinh viên – toà HA8'},{campus:'Lĩnh Nam',target:'Sảnh Truyền thống'},{campus:'Lĩnh Nam',target:'Văn phòng Đoàn – toà HA11'},{campus:'Lĩnh Nam',target:'Thang máy – toà HA10'},{campus:'Lĩnh Nam',target:'Thang máy – toà HA11'},{campus:'Lĩnh Nam',target:'Cầu nối giữa toà HA9 và HA11'},{campus:'Lĩnh Nam',target:'Hội trường lớn'}
  ];
  const day5QuestionBank=[
    quiz('Khi đi hỗ trợ sự kiện, bạn cần trang phục như thế nào?',['Áo 5S, quần lịch sự, giày hoặc dép sandal và đeo thẻ sinh viên','Trang phục tuỳ ý, không cần thẻ','Đồng phục thể thao và dép lê','Chỉ cần áo khoác CLB'],0),
    quiz('Khi đi hỗ trợ, điều quan trọng nhất bạn cần thực hiện là gì?',['Hỗ trợ theo sự chỉ dẫn của Thầy/Cô, Cán bộ, thành viên đầu mối của CLB','Tự ý đổi nhiệm vụ theo ý mình','Chỉ hỗ trợ việc mình thích','Chờ người khác phân công lại nhiều lần'],0),
    quiz('Điều không nên làm khi bạn đi hỗ trợ là gì?',['Bỏ về giữa chừng khi có công việc','Hỏi đầu mối khi chưa rõ việc','Phối hợp với các thành viên','Có mặt đúng giờ'],0)
  ];
  const day6QuestionBank=[
    quiz('Khi nghe tin hôm nay CLB họp có quà, phản ứng nào vui nhất?',['Giả vờ không quan tâm nhưng hóng tin rất kỹ','Bình thường thôi, có gì đâu','Xin nghỉ vì cảm thấy ngại','Thôi xủi một hôm vậy'],0),
    quiz('Khi nghe tin hôm nay CLB chuẩn bị đi picnic, bạn sẽ…',['Đóng tiền và lên xe!','Ở nhà chờ ảnh','Để mọi người đi trước','Quên mất lịch hẹn'],0),
    quiz('Tiêu đề sinh nhật 3 tuổi của CLB SCC là gì?',['Khúc giao thời','Chuyến xe kỷ niệm','Tiệc nhà S','Mùa xuân rộn ràng'],0),
    quiz('Tiêu đề lễ tri ân K16 và lễ chuyển giao thành viên Chủ nhiệm & Chuyên môn Gen 5 của CLB SCC là gì?',['Nhìn lại những kỷ niệm','Những ngày đáng nhớ','Trạm tri ân','Màu nắng hạ'],3)
  ];
  const day7QuestionBank=[quiz('Những lần sau, bạn sẽ thực hiện tốt nét đẹp Văn hoá học đường sinh viên chứ?',['Có nha!','Không…'],0),quiz('Nếu SCC có đợt đăng kí tuyển thành viên mới, bạn sẽ…',['Mời tất cả mọi người tham gia!','Giữ thông tin cho riêng mình','Khuyên mọi người đừng đăng kí','Chờ người khác hỏi mới kể'],0)];
  const state={player:'',score:0,dayIndex:0,taskIndex:0,dayPoints:0,completed:[],companionUsed:false,companionId:null,pendingCompanionId:null,retryUsedQuestion:false,tripleNext:false,streak:0,dayPerfect:true,dayBonusUsed:false,timer:null,stageTimer:null,typeTimer:null,overlayTimer:null,seconds:0,locked:true,muted:false,audio:null,awaitingNextDay:false,dayFailed:false};
  function normalizeNameForCheck(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
  function compactNameForCheck(value){return normalizeNameForCheck(value).replace(/\s+/g,'')}
  const INAPPROPRIATE_NAME_WORDS = new Set([
    'dit','ditme','ditmemay','ditconme','ditcu','deo','deoconme','lon','cac','buoi','daucu','ditcha','ditbo','dume','duma','damdang','choho','choch','sucvat','matday','matlon','matcac','ngu','nguhoc','occho','thangcho','concho','thangngu','conngu','khonnan','ditconme','ditmechungmay','ditmechungbay','ditmechungno','ditchungmay','ditchungbay','ditchungno','daucat','dauboi','daucho','daubuoi','condiem','diemchua','conmatlon','lonme','lonma','cacme','caccho','cutme','cutcha','cutbo','cuccut','cucshit','nhucc','nhucac','nhucuc','dm','dme','dmm','dms','dmcs','dcm','dcmay','dcmn','dcmml','dclmm','dklm','dkm','dkmm','dmmay','vcl','vkl','vcc','clgt','clmm',
    'fuck','fck','fuk','fucker','fuckyou','motherfucker','shit','shitty','bullshit','bitch','bitches','sonofabitch','ass','asshole','bastard','dick','dickhead','cock','cocksucker','pussy','cunt','whore','slut','hoe','porn','xxx','nigger','nigga','fag','faggot','retard','rape','rapist','blyat','blyad','bliat','блять','блядь','puta','puto','mierda','joder','coño','cabron','cabrón','merde','putain','scheisse','arschloch','kurwa','chuj','suka','сука','хуй'
  ].map(compactNameForCheck));
  const INAPPROPRIATE_NAME_FRAGMENTS = [
    'ditmemay','ditconme','ditme','deoconme','motherfucker','cocksucker','ditmechung','ditchung','condiem','daubuoi','dauboi','daucat','nhucc','nhucac','fuck','bitch','asshole','lon','bastard','dickhead','blyat','blyad','bliat','блять','блядь','puta','puto','mierda','joder','cabron','cabrón','merde','putain','scheisse','arschloch','kurwa','chuj','сука','хуй'
  ].map(compactNameForCheck);
  function hasInappropriateName(value){const normalized=normalizeNameForCheck(value);const tokens=normalized?normalized.split(/\s+/):[];const compact=normalized.replace(/\s+/g,'');if(tokens.some(token=>INAPPROPRIATE_NAME_WORDS.has(token))||INAPPROPRIATE_NAME_WORDS.has(compact))return true;return INAPPROPRIATE_NAME_FRAGMENTS.some(fragment=>{if(fragment.length>3)return compact.includes(fragment);if(tokens.includes(fragment))return true;const spaced=fragment.split('').join('\\s+');return new RegExp('(?:^|\\s)'+spaced+'(?=\\s|$)','iu').test(normalized)})}

  const companions=[
    {id:'tran-the-phu',name:'Trần Thế Phú',ability:'Mỗi câu sai được thêm một lần trả lời lại, kể cả câu chọn vị trí.',icon:'↺'},
    {id:'vu-thi-thu',name:'Vũ Thị Thu',ability:'Trả lời càng nhanh, điểm câu đúng càng cao.',icon:'<img class="companion-svg-icon" src="Image/bolt.svg" alt="">'},
    {id:'duong-thi-kim-anh',name:'Dương Thị Kim Anh',ability:'Mỗi câu đúng tung đồng xu: mặt ngửa nhân tổng điểm hiện có ×1.1.',icon:'◉'},
    {id:'nguyen-thu-hien',name:'Nguyễn Thu Hiền',ability:'Thời gian trả lời tăng lên 25 giây; chọn vị trí có 18 giây.',icon:'◷'},
    {id:'dong-ngoc-han',name:'Đồng Ngọc Hân',ability:'Sau mỗi câu lý thuyết là một câu tương tự lấy từ ngân hàng cùng ngày.',icon:'↔'},
    {id:'to-thi-ha-vy',name:'Tô Thị Hà Vy',ability:'Sau khi trả lời sai, câu kế tiếp được ×3 điểm nếu trả lời đúng.',icon:'×3'},
    {id:'nguyen-phuong-thao',name:'Nguyễn Phương Thảo',ability:'Một ngày hoàn hảo được nhân đôi điểm trong ngày (chỉ một lần).',icon:'✦'},
    {id:'vu-quang-viet',name:'Vũ Quang Việt',ability:'Mỗi câu đúng liên tiếp tăng thêm 20% điểm câu, tối đa +200%; trả lời sai thì streak về 0.',icon:'↗'}
  ];

  function quiz(text,options,answer,extra={}){return{kind:'quiz',text,options,answer,...extra}}
  function place(text,campus,target){return{kind:'place',text,campus,target}}
  function shuffleTasks(tasks){const shuffled=[...tasks];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}return shuffled}
  function pickRandomTasks(tasks,count){return shuffleTasks(tasks).slice(0,count)}
  function randomLocationTask(pool,prompt){const spot=pickRandomTasks(pool,1)[0];return place(prompt(spot),spot.campus,spot.target)}
  function withSimilarQuestions(tasks,bank){if(state.companionId!=='dong-ngoc-han')return tasks;const paired=[];for(const task of tasks){paired.push(task);if(task.kind==='quiz'){const similar=pickRandomTasks(bank.filter(item=>item.text!==task.text),1)[0]||task;paired.push({...similar})}}return paired}
  function prepareRandomQuestionSets(){
    days[0].tasks=withSimilarQuestions(pickRandomTasks(day1QuestionBank,3),day1QuestionBank);
    const directLocation=randomLocationTask(day2DirectLocations,spot=>'Bạn có lịch trực đầu giờ ở chỗ '+spot.target+'. Hãy chọn vị trí hoàn thành nhiệm vụ.');
    days[1].tasks=[branchTemplate,directLocation,...withSimilarQuestions(pickRandomTasks(day2DirectQuestionBank,2),day2DirectQuestionBank)];
    const prepLocation=randomLocationTask(day3OfficeLocations,spot=>'Bạn có lịch tuyên truyền và kiểm tra Văn hoá học đường. Hãy tập trung tại Phòng Chính trị & Công tác Sinh viên ở cơ sở '+spot.campus+' để chuẩn bị triển khai. Hãy chọn vị trí hoàn thành nhiệm vụ.');
    const fieldPool=day3ClassroomLocations.filter(spot=>spot.campus===prepLocation.campus);
    const fieldLocation=randomLocationTask(fieldPool,spot=>'Đội tuyên truyền và kiểm tra Văn hoá học đường muốn đến '+spot.target+' tại cơ sở '+spot.campus+' để tuyên truyền, kiểm tra. Hãy chọn vị trí hoàn thành nhiệm vụ.');
    days[2].tasks=[prepLocation,fieldLocation,...withSimilarQuestions(pickRandomTasks(day3QuestionBank,2),day3QuestionBank)];
    days[3].tasks=[randomLocationTask(day4MeetingLocations,spot=>'Bạn nhận thông báo họp CLB tại '+spot.target+' ở cơ sở '+spot.campus+'. Hãy chọn vị trí hoàn thành nhiệm vụ.'),...withSimilarQuestions(pickRandomTasks(day4QuestionBank,2),day4QuestionBank)];
    days[4].tasks=[...pickRandomTasks(day5EventLocations,2).map(spot=>place('Nghe tin có sự kiện, hội thảo cần hỗ trợ ở '+spot.target+'. CLB đang cần bạn đến hỗ trợ! Hãy chọn vị trí hoàn thành nhiệm vụ.',spot.campus,spot.target)),...withSimilarQuestions(pickRandomTasks(day5QuestionBank,2),day5QuestionBank)];
    days[5].tasks=withSimilarQuestions(pickRandomTasks(day6QuestionBank,2),day6QuestionBank);
    days[6].tasks=withSimilarQuestions(pickRandomTasks(day7QuestionBank,2),day7QuestionBank);
  }
  function rankFor(score){if(score<150)return'Hãy cố gắng lần sau nha!';if(score<300)return'Sinh viên lễ phép';if(score<450)return'Sinh viên tuyệt vời';if(score<600)return'Sinh viên 5S';return'Đại sứ Văn hoá học đường'}
  function loadBoard(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
  function saveBoard(){const board=loadBoard();board.push({name:state.player,score:state.score,rank:rankFor(state.score),id:`SCC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,date:new Date().toISOString()});board.sort((a,b)=>b.score-a.score);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(board.slice(0,10)))}catch{}renderBoard();renderBoard('result-leaderboard-list')}
  function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function renderBoard(target='leaderboard-list'){const el=$(target);if(!el)return;const board=loadBoard();if(!board.length){el.innerHTML='<div class="empty-leader">Chưa có dấu ấn nào — hãy là người đầu tiên hoàn thành tuần trải nghiệm!</div>';return}el.innerHTML=board.slice(0,6).map((x,i)=>`<div class="leader-row"><span class="leader-rank">${String(i+1).padStart(2,'0')}</span><span class="leader-name">${escapeHTML(x.name)}<span class="leader-level">${escapeHTML(x.rank)}</span></span><strong class="leader-score">${x.score}</strong></div>`).join('')}
  function showScreen(id){document.querySelectorAll('.screen').forEach(screen=>screen.classList.remove('active'));$(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}
  function clearTimers(){clearInterval(state.timer);clearTimeout(state.stageTimer);clearTimeout(state.typeTimer);clearTimeout(state.overlayTimer);state.timer=state.stageTimer=state.typeTimer=state.overlayTimer=null}
  function scheduleStage(callback,delay){clearTimeout(state.stageTimer);state.stageTimer=setTimeout(callback,delay)}
  function showOverlay(kicker,title,text,count){const overlay=$('game-overlay');clearTimeout(state.overlayTimer);state.overlayTimer=null;overlay.classList.remove('is-leaving');$('overlay-kicker').textContent=kicker||'';$('overlay-title').textContent=title||'';$('overlay-text').textContent=text||'';const counter=$('overlay-count');if(count===null||count===undefined){counter.hidden=true;counter.textContent=''}else{counter.hidden=false;counter.textContent=count}overlay.hidden=false}
  function hideOverlay(){const overlay=$('game-overlay');if(overlay.hidden)return;clearTimeout(state.overlayTimer);overlay.classList.add('is-leaving');state.overlayTimer=setTimeout(()=>{overlay.hidden=true;overlay.classList.remove('is-leaving');state.overlayTimer=null},240)}

  function start(){const value=$('player-name').value.trim();if(!value){$('player-name').focus();toast('Viết tên bạn vào nhật ký trước nhé!');return}if(hasInappropriateName(value)){$('player-name').focus();toast('Tên này chưa phù hợp. Bạn thử nhập một tên khác nhé!');return}soundCue('tap');state.player=value.slice(0,24);state.pendingCompanionId=null;renderCompanionPicker();$('companion-modal').hidden=false}
  function renderCompanionPicker(){$('companion-grid').innerHTML=companions.map(person=>`<button class="companion-option" type="button" data-companion="${person.id}" aria-pressed="false"><span class="companion-icon">${person.icon}</span><span class="companion-name">${person.name}</span><span class="companion-ability">${person.ability}</span></button>`).join('');$('companion-selected-label').textContent='Hãy chọn một người đồng hành';$('confirm-companion-btn').disabled=true;$('companion-grid').querySelectorAll('.companion-option').forEach(button=>button.addEventListener('click',()=>{state.pendingCompanionId=button.dataset.companion;$('companion-grid').querySelectorAll('.companion-option').forEach(option=>{const selected=option.dataset.companion===state.pendingCompanionId;option.classList.toggle('selected',selected);option.setAttribute('aria-pressed',String(selected))});const chosen=companions.find(person=>person.id===state.pendingCompanionId);soundCue('select');$('companion-selected-label').textContent='Đồng hành cùng '+chosen.name;$('confirm-companion-btn').disabled=false}))}
  function launchGame(){if(!state.pendingCompanionId){toast('Chọn một người đồng hành trước nhé!');return}state.companionId=state.pendingCompanionId;$('companion-modal').hidden=true;soundCue('start');clearTimers();prepareRandomQuestionSets();state.score=0;state.dayIndex=0;state.taskIndex=0;state.dayPoints=0;state.completed=[];state.companionUsed=false;state.retryUsedQuestion=false;state.tripleNext=false;state.streak=0;state.dayPerfect=true;state.dayBonusUsed=false;state.locked=true;state.awaitingNextDay=false;state.dayFailed=false;$('player-label').textContent=state.player;$('player-avatar').textContent=state.player.charAt(0).toUpperCase();$('companion-label').textContent=companions.find(person=>person.id===state.companionId).name;$('score-value').textContent='0';showScreen('game-screen');$('question-card').hidden=false;renderDayShell();runStartCountdown()}
  function runStartCountdown(value=3){state.locked=true;if(value>0)soundCue('countdown');showOverlay('SCHOOL CULTURE DIARY',value>0?'Sẵn sàng chưa?':'Bắt đầu!',`Chuyến hành trình SCC của ${state.player} sắp bắt đầu.`,value>0?value:null);if(value>0){scheduleStage(()=>runStartCountdown(value-1),1000);return}scheduleStage(()=>{hideOverlay();beginDayIntro()},700)}
  function beginDayIntro(){const day=days[state.dayIndex];soundCue('day');state.locked=true;state.awaitingNextDay=false;$('question-card').hidden=false;$('story-card').classList.remove('bad-ending');$('story-icon').textContent=day.icon;$('story-text').textContent=storyFor(day);showOverlay(`NGÀY ${state.dayIndex+1} · ${day.label}`,day.title,storyFor(day));scheduleStage(()=>{hideOverlay();renderTask()},3500)}
  function storyFor(day){return state.player?`${state.player}, ${day.story}`:day.story}
  function renderDayNav(){const names=['Làm quen','Trực đầu giờ','Tuyên truyền','Họp CLB','Hỗ trợ','Gắn kết','Cảm nhận'];$('day-list').innerHTML=days.map((_,i)=>`<div class="day-nav ${i===state.dayIndex?'current':''} ${state.completed.includes(i)?'done':''}"><span class="day-num">${state.completed.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><span>${names[i]}</span></div>`).join('')}
  function updateDayHeading(){const day=days[state.dayIndex];$('day-overline').textContent=`NGÀY ${String(state.dayIndex+1).padStart(2,'0')} · ${day.label}`;$('day-title').textContent=day.title;$('progress-label').textContent=`${String(state.dayIndex+1).padStart(2,'0')} / 07`;$('progress-bar').style.width=`${((state.dayIndex+1)/7)*100}%`;renderDayNav()}
  function renderTask(){clearInterval(state.timer);clearTimeout(state.typeTimer);state.locked=true;state.awaitingNextDay=false;state.retryUsedQuestion=false;const task=days[state.dayIndex].tasks[state.taskIndex];if(!task){completeDay();return}updateDayHeading();$('question-card').hidden=false;$('story-card').classList.remove('bad-ending');$('story-icon').textContent=days[state.dayIndex].icon;$('story-text').textContent=days[state.dayIndex].story;const timerLimit=questionTime(task);$('question-type').textContent=task.kind==='place'?'CHỌN ĐỊA ĐIỂM · '+timerLimit+' GIÂY':task.kind==='branch'?'CHỌN CA TRỰC · '+timerLimit+' GIÂY':'CÂU HỎI · '+timerLimit+' GIÂY';const countedTasks=days[state.dayIndex].tasks.filter(item=>item.kind!=='branch');const questionNumber=days[state.dayIndex].tasks.slice(0,state.taskIndex+1).filter(item=>item.kind!=='branch').length;$('question-counter').textContent=task.kind==='branch'?'CHỌN CA TRỰC':`CÂU ${questionNumber} / ${countedTasks.length}`;$('question-text').textContent='';$('question-text').classList.add('typewriter');$('timer-value').textContent='—';$('timer-bar').style.width='0%';$('timer-bar').style.background='';$('feedback').textContent='';$('feedback').className='feedback';$('feedback-actions').hidden=true;$('continue-btn').textContent='Tiếp tục →';$('day-points').textContent=`+${state.dayPoints} điểm hôm nay`;
    const area=$('answer-area');area.innerHTML='';area.classList.add('answer-waiting');const options=task.kind==='place'?placeOptions(task):shuffleTasks(task.options.map((label,index)=>({label,correct:task.kind==='branch'||index===task.answer})));for(const option of options){const button=document.createElement('button');button.type='button';button.className='answer-option';button.textContent=option.label;button.disabled=true;button.dataset.correct=String(option.correct);button.addEventListener('click',()=>handleAnswer(option.correct,button,option.label,false));area.appendChild(button)}
    typeText(task.text,()=>{area.classList.remove('answer-waiting');area.querySelectorAll('button').forEach(button=>button.disabled=false);startQuestionTimer(timerLimit,task)});
  }
  function typeText(text,done){const node=$('question-text');let index=0;node.textContent='';function step(){if(index>=text.length){node.classList.remove('typewriter');state.typeTimer=null;done();return}node.textContent+=text.charAt(index++);state.typeTimer=setTimeout(step,24)}step()}
  function questionTime(task){if(state.companionId==='nguyen-thu-hien')return task.kind==='place'?18:25;return task.kind==='place'?10:15}
  function startQuestionTimer(seconds,task){state.locked=false;state.seconds=seconds;$('timer-value').textContent=seconds;$('timer-bar').style.width='100%';const bar=$('timer-bar');bar.style.background='';state.timer=setInterval(()=>{state.seconds--; $('timer-value').textContent=Math.max(state.seconds,0);$('timer-bar').style.width=`${Math.max(0,state.seconds/seconds*100)}%`;if(state.seconds<=4)bar.style.background='#b92720';if(state.seconds<=0){clearInterval(state.timer);state.timer=null;handleTimeout(task)}},1000)}
  // Mỗi lần hiện câu vị trí: rút đáp án nhiễu ngẫu nhiên trong đúng cơ sở rồi xáo thứ tự lựa chọn.
  function placeOptions(task){const pool=task.campus==='Minh Khai'?mkPlaces:lnPlaces;const options=[task.target,...pool.filter(item=>item!==task.target).sort(()=>Math.random()-.5).slice(0,3)];return options.sort(()=>Math.random()-.5).map(label=>({label,correct:label===task.target}))}
  function handleAnswer(correct,button,label,expired){if(state.locked)return;const task=days[state.dayIndex].tasks[state.taskIndex];if(task.kind==='branch'){commitBranch(expired?Math.floor(Math.random()*2):task.options.indexOf(label),expired);return}state.locked=true;clearInterval(state.timer);state.timer=null;$('answer-area').querySelectorAll('button').forEach(item=>item.disabled=true);if(!correct){state.dayPerfect=false;if(state.companionId==='vu-quang-viet')state.streak=0;if(state.companionId==='to-thi-ha-vy')state.tripleNext=true;if(state.companionId==='tran-the-phu'&&!state.retryUsedQuestion){state.retryUsedQuestion=true;if(button)button.classList.add('wrong');$('answer-area').querySelectorAll('button').forEach(item=>{item.disabled=item===button});$('feedback').textContent='Một lần thử lại nhờ '+companionName()+'. Chọn đáp án khác nhé!';$('feedback').className='feedback show bad';tone(220);startQuestionTimer(questionTime(task),task);return}}if(button)button.classList.add(correct?'correct':'wrong');markCorrectAnswer();
    if(task.kind==='place'&&!correct){$('feedback').textContent=expired?'Hết giờ — địa điểm đúng là '+task.target+'.':'Bạn đã chọn '+label+'. Địa điểm đúng là '+task.target+'.';$('feedback').className='feedback show bad';tone(220);scheduleStage(()=>showBadEnding(label,task.target),1500);return}
    if(correct){const earned=correctAnswerPoints();award(earned.points);if(earned.multiplyCurrentScore){const before=state.score;const after=Math.round(before*1.1);earned.bonusPoints=after-before;if(earned.bonusPoints)award(earned.bonusPoints);earned.note='Đồng xu mặt ngửa — tổng điểm hiện có ×1.1!'}const totalAwarded=earned.points+(earned.bonusPoints||0);$('feedback').textContent=(task.kind==='place'?'Chính xác! Bạn đã có mặt đúng điểm nhiệm vụ. ':'Chính xác! Bạn đã ghi thêm một dấu ấn đẹp. ')+(earned.note?earned.note+' ':'')+'+'+totalAwarded+' điểm ✦';$('feedback').className='feedback show';tone(660)}
    else{$('feedback').textContent=expired?'Hết giờ! Đáp án đúng là: '+correctAnswer(task)+'.':'Chưa chính xác. Đáp án đúng là: '+correctAnswer(task)+'.';$('feedback').className='feedback show bad';tone(220)}
    if(correct&&task.kind==='place'){scheduleStage(()=>{$('feedback-actions').hidden=false;$('continue-btn').textContent='Tiếp tục →'},1500)}else{$('feedback-actions').hidden=false;$('continue-btn').textContent='Tiếp tục →'}
  }
  function companionName(){return(companions.find(person=>person.id===state.companionId)||{}).name||'người đồng hành'}
  function correctAnswerPoints(){let points=10,note='';if(state.companionId==='vu-thi-thu'){points+=Math.max(0,state.seconds);note='Trả lời nhanh: +'+Math.max(0,state.seconds)+' điểm thưởng.'}if(state.companionId==='duong-thi-kim-anh'){soundCue('coin');if(Math.random()<.5)return{points,note:'Đồng xu mặt ngửa — tổng điểm hiện có ×1.1!',multiplyCurrentScore:true};note='Đồng xu mặt sấp — giữ nguyên điểm.'}if(state.companionId==='to-thi-ha-vy'&&state.tripleNext){points*=3;state.tripleNext=false;note='Năng lực ×3 được kích hoạt!'}if(state.companionId==='vu-quang-viet'){state.streak++;const bonusPercent=Math.min(state.streak*20,200);points=Math.round(points*(1+bonusPercent/100));note='Streak '+state.streak+' câu đúng: +'+bonusPercent+'% điểm câu!'}return{points,note}}
  function handleTimeout(task){if(task.kind==='branch'){commitBranch(Math.floor(Math.random()*2),true);return}handleAnswer(false,null,'',true)}
  function markCorrectAnswer(){const correct=$('answer-area').querySelector('.answer-option[data-correct="true"]');if(correct)correct.classList.add('correct')}
  function correctAnswer(task){return task.kind==='place'?task.target:task.options[task.answer]}
  function commitBranch(index,automatic){
    soundCue('select');clearInterval(state.timer);state.timer=null;state.locked=true;
    if(index===1){
      const locationTask=randomLocationTask(day2AdminLocations,spot=>'Bạn có lịch trực bộ phận hành chính 1 cửa tại '+spot.target+' ('+spot.campus+'). Hãy chọn vị trí hoàn thành nhiệm vụ.');
      days[1].tasks=[branchTemplate,locationTask,...withSimilarQuestions(pickRandomTasks(day2AdminQuestionBank,2),day2AdminQuestionBank)];
      showOverlay('NGÀY 2 · CA TRỰC ĐÃ CHỐT','Bộ phận hành chính 1 cửa',automatic?'Hết giờ nên hệ thống đã chọn ngẫu nhiên. Hôm nay bạn trực tại '+locationTask.target+'.':'Bạn đã chọn ca trực tại '+locationTask.target+'.');
    }else{
      const locationTask=randomLocationTask(day2DirectLocations,spot=>'Bạn có lịch trực đầu giờ ở chỗ '+spot.target+'. Hãy chọn vị trí hoàn thành nhiệm vụ.');
      days[1].tasks=[branchTemplate,locationTask,...withSimilarQuestions(pickRandomTasks(day2DirectQuestionBank,2),day2DirectQuestionBank)];
      showOverlay('NGÀY 2 · CA TRỰC ĐÃ CHỐT','Trực đầu giờ',automatic?'Hết giờ nên hệ thống đã chọn ngẫu nhiên ca trực đầu giờ tại '+locationTask.target+'.':'Bạn đã chọn ca trực đầu giờ tại '+locationTask.target+'.');
    }
    state.taskIndex=1;scheduleStage(()=>{hideOverlay();renderTask()},1500);
  }
  function handleContinue(){soundCue('tap');if(state.awaitingNextDay){advanceDay();return}nextTask()}
  function nextTask(){state.taskIndex++;renderTask()}
  function completeDay(){soundCue('dayEnd');clearTimers();state.locked=true;if(state.dayFailed)return;let perfectBonus=0;if(!state.completed.includes(state.dayIndex)){state.completed.push(state.dayIndex);award(25);if(state.companionId==='nguyen-phuong-thao'&&state.dayPerfect&&!state.dayBonusUsed){perfectBonus=state.dayPoints;state.dayBonusUsed=true;award(perfectBonus)}}updateDayHeading();$('question-card').hidden=true;$('story-card').classList.remove('bad-ending');$('story-icon').textContent='✓';$('story-text').textContent=days[state.dayIndex].ending;$('feedback').textContent=`${days[state.dayIndex].ending} `+(perfectBonus?'Ngày hoàn hảo: toàn bộ điểm trong ngày, gồm thưởng hoàn thành, đã được nhân đôi! ':'')+'Bạn nhận thêm 25 điểm hoàn thành ngày.';$('feedback').className='feedback show';$('feedback-actions').hidden=false;$('continue-btn').textContent=state.dayIndex===days.length-1?'Khép lại tuần →':'Ngày tiếp theo →';$('day-points').textContent=`+${state.dayPoints} điểm hôm nay`;state.awaitingNextDay=true}
  function showBadEnding(chosen,correct){clearTimers();state.dayFailed=true;state.locked=true;$('question-card').hidden=true;$('story-card').classList.add('bad-ending');$('story-icon').textContent='×';$('story-text').textContent='BAD ENDING — Nhiệm vụ hôm nay chưa hoàn thành. Một tình huống mới sẽ chờ bạn vào ngày mai.';$('feedback').textContent=`Bạn chọn: ${chosen||'không chọn kịp'}. Địa điểm được giao: ${correct}. Ngày này kết thúc tại đây.`;$('feedback').className='feedback show bad';$('feedback-actions').hidden=false;$('continue-btn').textContent=state.dayIndex===days.length-1?'Khép lại tuần →':'Sang ngày tiếp theo →';state.awaitingNextDay=true}
  function advanceDay(){clearTimers();if(state.dayIndex>=days.length-1){finish();return}state.dayIndex++;state.taskIndex=0;state.dayPoints=0;state.dayFailed=false;state.dayPerfect=true;state.awaitingNextDay=false;renderDayShell();beginDayIntro()}
  function renderDayShell(){const day=days[state.dayIndex];updateDayHeading();$('question-card').hidden=false;$('story-card').classList.remove('bad-ending');$('story-icon').textContent=day.icon;$('story-text').textContent=storyFor(day);$('score-value').textContent=state.score;$('day-points').textContent=`+${state.dayPoints} điểm hôm nay`}
  function award(points){state.score+=points;state.dayPoints+=points;$('score-value').textContent=state.score;$('day-points').textContent=`+${state.dayPoints} điểm hôm nay`}
  function finish(){soundCue('finish');clearTimers();hideOverlay();const fullWeek=state.completed.length===days.length;if(fullWeek)award(50);saveBoard();$('result-subtitle').textContent=`${state.player}, cảm ơn bạn đã đồng hành cùng SCC suốt tuần qua.`;$('final-score').textContent=state.score;$('rank-stamp').textContent=rankFor(state.score).toLocaleUpperCase('vi');$('result-message').textContent=fullWeek?'Bảy ngày, bảy dấu ấn — bạn nhận thêm 50 điểm hoàn thành tuần. Hãy tiếp tục lan toả nét đẹp văn hoá học đường 5S!':'Mỗi trải nghiệm đều đáng quý. Những ngày chưa trọn vẹn sẽ là động lực để bạn viết tiếp hành trình cùng SCC.';$('result-days').innerHTML=days.map((_,i)=>`<span class="result-day ${state.completed.includes(i)?'completed':''}" title="Ngày ${i+1}">${state.completed.includes(i)?'✓':i+1}</span>`).join('');showScreen('result-screen')}
  function toast(text){const node=$('toast');node.textContent=text;node.classList.add('show');setTimeout(()=>node.classList.remove('show'),2200)}
  function playSoundNotes(notes,volume=.016){if(state.muted)return;try{const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;state.audio ||= new AudioCtor();if(state.audio.state==='suspended')state.audio.resume().catch(()=>{});const now=state.audio.currentTime;for(const [frequency,delay,duration] of notes){const oscillator=state.audio.createOscillator(),gain=state.audio.createGain(),start=now+delay;oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.linearRampToValueAtTime(volume,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);oscillator.connect(gain);gain.connect(state.audio.destination);oscillator.start(start);oscillator.stop(start+duration+.015)}}catch{}}
  function soundCue(name){const patterns={tap:[[587,0,.12],[740,.075,.16]],select:[[523,0,.16],[659,.11,.18]],start:[[523,0,.2],[659,.14,.22],[784,.29,.32]],countdown:[[659,0,.12],[784,.09,.18]],day:[[523,0,.25],[659,.16,.27],[784,.32,.42]],dayEnd:[[659,0,.22],[784,.14,.25],[988,.29,.4]],coin:[[784,0,.1],[988,.09,.14],[1175,.19,.22]],correct:[[523,0,.16],[659,.1,.18],[784,.22,.28]],finish:[[523,0,.3],[659,.16,.32],[784,.32,.34],[1047,.5,.58]],error:[[392,0,.14],[349,.12,.2]]};playSoundNotes(patterns[name]||patterns.tap,name==='error'?.011:.016)}
  function tone(freq){if(freq>=500)soundCue('correct');else soundCue('error')}

  $('confirm-companion-btn').addEventListener('click',launchGame);
  $('companion-modal').addEventListener('click',event=>{if(event.target===$('companion-modal'))$('companion-modal').hidden=true});
  $('start-btn').addEventListener('click',start);
  $('player-name').addEventListener('keydown',event=>{if(event.key==='Enter')start()});
  $('continue-btn').addEventListener('click',handleContinue);
  $('quit-btn').addEventListener('click',()=>{if(confirm('Thoát nhật ký? Lượt chơi hiện tại sẽ không được lưu vào bảng điểm.')){clearTimers();hideOverlay();showScreen('home-screen');renderBoard()}});
  $('play-again-btn').addEventListener('click',()=>{$('player-name').value=state.player;showScreen('home-screen');$('player-name').focus()});
  $('back-home-btn').addEventListener('click',()=>{showScreen('home-screen');renderBoard()});
  $('sound-toggle').addEventListener('click',()=>{state.muted=!state.muted;$('sound-toggle').innerHTML=state.muted?'♪ <span>Âm thanh</span>':'♫ <span>Âm thanh</span>';toast(state.muted?'Đã tắt âm thanh':'Đã bật âm thanh')});
  renderCompanionPicker();
  const loadingStartedAt=Date.now();
  let loadingDismissed=false;
  let loadingFallbackTimer=0;
  function dismissLoadingScreen(){if(loadingDismissed)return;const loader=$('loading-screen');if(!loader){loadingDismissed=true;return}loadingDismissed=true;clearTimeout(loadingFallbackTimer);loader.classList.add('is-hidden');setTimeout(()=>loader.remove(),520)}
  function dismissAfterMinimumDisplay(){if(loadingDismissed)return;const delay=Math.max(0,720-(Date.now()-loadingStartedAt));setTimeout(dismissLoadingScreen,delay)}
  loadingFallbackTimer=setTimeout(dismissLoadingScreen,3200);
  if(document.readyState==='complete')dismissAfterMinimumDisplay();else window.addEventListener('load',dismissAfterMinimumDisplay,{once:true});  renderBoard();
})();

(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#f5b653', '#ef792c', '#d9472b', '#ffd98a', '#b92720', '#fff1c9', '#e98a5b'];
  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  function drawStar(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4, r = i % 2 ? s * 0.25 : s;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  /* ---------- Hạt lơ lửng nền (sao + cánh hoa) ---------- */
  function initAmbient() {
    if (reduce) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'fx-ambient';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, ratio = 1, parts = [], running = true;

    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 20 * ratio,
      r: (Math.random() * 5 + 3) * ratio,
      vy: -(Math.random() * 0.28 + 0.1) * ratio,
      sw: Math.random() * Math.PI * 2,
      sv: Math.random() * 0.012 + 0.004,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.012,
      star: Math.random() < 0.45,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.3 + 0.18,
    });
    function resize() {
      ratio = dpr();
      w = canvas.width = Math.floor(window.innerWidth * ratio);
      h = canvas.height = Math.floor(window.innerHeight * ratio);
      const n = window.innerWidth < 650 ? 14 : 30;
      parts = Array.from({ length: n }, () => make(true));
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += p.vy; p.sw += p.sv; p.rot += p.vr;
        p.x += Math.sin(p.sw) * 0.35 * ratio;
        if (p.y < -30 * ratio) Object.assign(p, make(false));
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        if (p.star) drawStar(ctx, p.r);
        else { ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, 6.283); ctx.fill(); }
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      const was = running;
      running = !document.hidden;
      if (running && !was) requestAnimationFrame(frame);
    });
    resize();
    requestAnimationFrame(frame);
  }

  /* ---------- Pháo hoa / confetti ---------- */
  let bc = null, bctx = null, bparts = [], raf = 0;
  function ensureBurst() {
    if (bc) return;
    bc = document.createElement('canvas');
    bc.id = 'fx-burst';
    bc.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bc);
    bctx = bc.getContext('2d');
    const size = () => { const r = dpr(); bc.width = Math.floor(innerWidth * r); bc.height = Math.floor(innerHeight * r); };
    size();
    window.addEventListener('resize', size);
  }
  function loop() {
    const w = bc.width, h = bc.height;
    bctx.clearRect(0, 0, w, h);
    bparts = bparts.filter((p) => p.life > 0 && p.y < h + 60);
    for (const p of bparts) {
      p.vy += p.g; p.vx *= p.drag; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      bctx.save();
      bctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.fade));
      bctx.translate(p.x, p.y);
      bctx.rotate(p.rot);
      bctx.fillStyle = p.c;
      if (p.shape === 'rect') bctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6);
      else if (p.shape === 'star') drawStar(bctx, p.s);
      else { bctx.beginPath(); bctx.arc(0, 0, p.s / 2, 0, 6.283); bctx.fill(); }
      bctx.restore();
    }
    if (bparts.length) raf = requestAnimationFrame(loop);
    else { raf = 0; bctx.clearRect(0, 0, w, h); }
  }
  function push(list) {
    bparts.push(...list);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function burst(x, y, count = 26) {
    if (reduce) return;
    ensureBurst();
    const r = dpr();
    const list = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, sp = (Math.random() * 5 + 2) * r;
      list.push({
        x: x * r, y: y * r, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2 * r,
        g: 0.17 * r, drag: 0.985, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        s: (Math.random() * 6 + 4) * r, c: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() < 0.5 ? 'star' : 'circle', life: 55 + Math.random() * 25, fade: 30,
      });
    }
    push(list);
  }
  function confetti(count = 140, waves = 1) {
    if (reduce) return;
    ensureBurst();
    const r = dpr();
    for (let k = 0; k < waves; k++) {
      setTimeout(() => {
        const list = [];
        for (let i = 0; i < count; i++) {
          const fromLeft = i % 2 === 0;
          const a = (fromLeft ? -0.35 : -Math.PI + 0.35) + (Math.random() - 0.5) * 0.8;
          const sp = (Math.random() * 9 + 7) * r;
          list.push({
            x: (fromLeft ? 0 : innerWidth) * r, y: innerHeight * 0.75 * r,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4 * r,
            g: 0.22 * r, drag: 0.985, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
            s: (Math.random() * 7 + 6) * r, c: COLORS[(Math.random() * COLORS.length) | 0],
            shape: ['rect', 'rect', 'star', 'circle'][(Math.random() * 4) | 0], life: 150 + Math.random() * 60, fade: 50,
          });
        }
        push(list);
      }, k * 380);
    }
  }
  function floatText(text, x, y) {
    if (reduce) return;
    const el = document.createElement('div');
    el.className = 'fx-float';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
  const center = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r]; };

  /* ---------- Phản hồi khi trả lời ---------- */
  function initGameFx() {
    const fb = $('feedback'), card = $('question-card'), story = $('story-card');
    if (!fb || !card) return;
    let lastKey = '';
    new MutationObserver(() => {
      if (!fb.classList.contains('show')) { lastKey = ''; return; }
      const text = fb.textContent || '';
      const key = text + '|' + fb.className + '|' + card.hidden;
      if (key === lastKey) return;
      lastKey = key;
      card.classList.remove('urgent');

      if (card.hidden) {
        if (!story.classList.contains('bad-ending')) confetti(70, 2);
        return;
      }
      const bad = fb.classList.contains('bad');
      if (bad) {
        card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
        return;
      }
      if (/^Chính xác/.test(text)) {
        const target = card.querySelector('.answer-option.correct');
        const [x, y, rect] = target ? center(target) : center(card);
        burst(x, y, 28);
        const m = text.match(/\+(\d+) điểm/);
        if (m) floatText('+' + m[1], x, rect.top);
      }
    }).observe(fb, { attributes: true, attributeFilter: ['class'], childList: true, characterData: true, subtree: true });

    // Cảnh báo sắp hết giờ
    const timer = $('timer-value');
    if (timer) new MutationObserver(() => {
      const n = parseInt(timer.textContent, 10);
      card.classList.toggle('urgent', Number.isFinite(n) && n > 0 && n <= 4);
    }).observe(timer, { childList: true, characterData: true, subtree: true });

    // Điểm nhảy khi tăng
    const score = $('score-value');
    if (score) {
      let prev = parseInt(score.textContent, 10) || 0;
      new MutationObserver(() => {
        const now = parseInt(score.textContent, 10) || 0;
        if (now > prev) { score.classList.remove('bump'); void score.offsetWidth; score.classList.add('bump'); }
        prev = now;
      }).observe(score, { childList: true, characterData: true, subtree: true });
    }
  }

  /* ---------- Màn kết quả: đếm điểm + confetti ---------- */
  function initResult() {
    const screen = $('result-screen'), el = $('final-score');
    if (!screen || !el) return;
    let wasActive = screen.classList.contains('active');
    new MutationObserver(() => {
      const active = screen.classList.contains('active');
      if (active && !wasActive) {
        const target = parseInt(el.textContent, 10) || 0;
        if (!reduce && target > 0) {
          const t0 = performance.now(), dur = 1500;
          el.textContent = '0';
          const step = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        confetti(160, 3);
      }
      wasActive = active;
    }).observe(screen, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- Cuốn nhật ký nghiêng 3D theo con trỏ ---------- */
  function initTilt() {
    const art = document.querySelector('.hero-art'), book = document.querySelector('.diary-book');
    if (!art || !book || reduce || !window.matchMedia('(hover: hover)').matches) return;
    art.addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      book.style.setProperty('--ry', (px * 18).toFixed(1) + 'deg');
      book.style.setProperty('--rx', (-py * 14).toFixed(1) + 'deg');
    });
    art.addEventListener('pointerleave', () => {
      book.style.setProperty('--ry', '0deg');
      book.style.setProperty('--rx', '0deg');
    });
  }

  /* ---------- Tia sáng nhỏ khi bấm nút / chọn đồng hành ---------- */
  function initClickSparks() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest && e.target.closest('.primary-btn, .companion-option');
      if (!t || t.disabled) return;
      if(typeof window.burst==='function')window.burst(e.clientX,e.clientY,12);
    });
  }

  if(typeof window.initAmbient==='function')window.initAmbient();
  if(typeof window.initGameFx==='function')window.initGameFx();
  initResult();
  initTilt();
  initClickSparks();
})();












