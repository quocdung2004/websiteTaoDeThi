const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");

// Đây chính là cục JSON mà Gemini vừa trả về cho bạn
const examData = {
  "thong_tin_chung": {
    "mon_hoc": "Toán",
    "lop": 9,
    "chu_de": "Hệ phương trình bậc nhất hai ẩn",
    "thoi_gian_lam_bai": "15 phút"
  },
  "trac_nghiem": [
    {
      "cau_so": 1,
      "noi_dung": "Cặp số (x; y) nào sau đây là nghiệm của hệ phương trình: \\(\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}\\)?",
      "lua_chon": { "A": "(1; 2)", "B": "(2; 1)", "C": "(3; -1)", "D": "(0; 5)" }
    },
    {
      "cau_so": 2,
      "noi_dung": "Số nghiệm của hệ phương trình \\(\\begin{cases} x + 2y = 3 \\\\ 2x + 4y = 5 \\end{cases}\\) là:",
      "lua_chon": { "A": "Vô nghiệm", "B": "Có 1 nghiệm duy nhất", "C": "Có vô số nghiệm", "D": "Có 2 nghiệm phân biệt" }
    }
  ],
  "tu_luan": [
    {
      "cau_so": 1,
      "noi_dung": "Giải hệ phương trình sau bằng phương pháp thế hoặc cộng đại số: \\(\\begin{cases} 2x + 3y = 7 \\\\ 3x - y = 5 \\end{cases}\\)"
    }
  ]
};

async function generateWordFile() {
  // Mảng chứa các đoạn văn bản (Paragraph) sẽ đưa vào file Word
  const docChildren = [];

  // 1. TIÊU ĐỀ
  docChildren.push(
    new Paragraph({
      text: `ĐỀ KIỂM TRA MÔN ${examData.thong_tin_chung.mon_hoc.toUpperCase()} - LỚP ${examData.thong_tin_chung.lop}`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: `Chủ đề: ${examData.thong_tin_chung.chu_de} | Thời gian: ${examData.thong_tin_chung.thoi_gian_lam_bai}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }, // Tạo khoảng trống phía dưới
    })
  );

  // 2. PHẦN TRẮC NGHIỆM
  docChildren.push(
    new Paragraph({ text: "I. PHẦN TRẮC NGHIỆM", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } })
  );

  examData.trac_nghiem.forEach((cau) => {
    // Thêm câu hỏi
    docChildren.push(new Paragraph({
        children: [new TextRun({ text: `Câu ${cau.cau_so}: `, bold: true }), new TextRun(cau.noi_dung)],
        spacing: { after: 100 }
    }));
    // Thêm 4 đáp án (mỗi đáp án 1 dòng để dễ nhìn)
    docChildren.push(new Paragraph({ text: `A. ${cau.lua_chon.A}` }));
    docChildren.push(new Paragraph({ text: `B. ${cau.lua_chon.B}` }));
    docChildren.push(new Paragraph({ text: `C. ${cau.lua_chon.C}` }));
    docChildren.push(new Paragraph({ text: `D. ${cau.lua_chon.D}`, spacing: { after: 200 } }));
  });

  // 3. PHẦN TỰ LUẬN
  docChildren.push(
    new Paragraph({ text: "II. PHẦN TỰ LUẬN", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } })
  );

  examData.tu_luan.forEach((cau) => {
    docChildren.push(new Paragraph({
        children: [new TextRun({ text: `Câu ${cau.cau_so}: `, bold: true }), new TextRun(cau.noi_dung)],
        spacing: { after: 400 } // Khoảng trống để học sinh làm bài
    }));
  });

  // TẠO DOCUMENT
  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren,
    }],
  });

  // LƯU FILE
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("De_Kiem_Tra_AI.docx", buffer);
  console.log("✅ Thành công! Hãy kiểm tra thư mục backend, bạn sẽ thấy file De_Kiem_Tra_AI.docx");
}

generateWordFile();