require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } = require('docx');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

// HÀM TẠO FILE WORD TỪ DỮ LIỆU JSON
async function createWordBuffer(examData) {
    const docChildren = [];
    
    const monHoc = examData?.thong_tin_chung?.mon_hoc || "MÔN HỌC";
    const lop = examData?.thong_tin_chung?.lop || "9";
    const chuDe = examData?.thong_tin_chung?.chu_de || "Chủ đề kiểm tra";
    const thoiGian = examData?.thong_tin_chung?.thoi_gian_lam_bai || "45 phút";

    // ==========================================
    // PHẦN 1: ĐỀ KIỂM TRA
    // ==========================================
    docChildren.push(
        new Paragraph({ 
            text: `ĐỀ KIỂM TRA MÔN ${monHoc.toUpperCase()} - LỚP ${lop}`, 
            heading: HeadingLevel.HEADING_1, 
            alignment: AlignmentType.CENTER 
        }),
        new Paragraph({ 
            text: `Chủ đề: ${chuDe} | Thời gian: ${thoiGian}`, 
            alignment: AlignmentType.CENTER, 
            spacing: { after: 400 } 
        })
    );

    // 1.1 Câu hỏi Trắc nghiệm
    if (examData?.trac_nghiem && examData.trac_nghiem.length > 0) {
        docChildren.push(new Paragraph({ text: "I. PHẦN TRẮC NGHIỆM", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }));
        examData.trac_nghiem.forEach((cau) => {
            docChildren.push(new Paragraph({ 
                children: [
                    new TextRun({ text: `Câu ${cau.cau_so}: `, bold: true }), 
                    new TextRun(cau.noi_dung || "")
                ], 
                spacing: { after: 100 } 
            }));

            if (cau.lua_chon && typeof cau.lua_chon === 'object') {
                Object.entries(cau.lua_chon).forEach(([key, val]) => {
                    docChildren.push(new Paragraph({ text: `${key}. ${val || ""}` }));
                });
                docChildren.push(new Paragraph({ text: "", spacing: { after: 150 } }));
            }
        });
    }

    // 1.2 Câu hỏi Tự luận
    if (examData?.tu_luan && examData.tu_luan.length > 0) {
        docChildren.push(new Paragraph({ text: "II. PHẦN TỰ LUẬN", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }));
        examData.tu_luan.forEach((cau) => {
            docChildren.push(new Paragraph({ 
                children: [
                    new TextRun({ text: `Câu ${cau.cau_so}: `, bold: true }), 
                    new TextRun(cau.noi_dung || "")
                ], 
                spacing: { after: 300 } 
            }));
        });
    }

    // ==========================================
    // PHẦN 2: ĐÁP ÁN & HƯỚNG DẪN CHẤM (TRANG MỚI)
    // ==========================================
    docChildren.push(new Paragraph({ children: [new PageBreak()] }));
    docChildren.push(new Paragraph({ 
        text: "HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN", 
        heading: HeadingLevel.HEADING_1, 
        alignment: AlignmentType.CENTER, 
        spacing: { after: 400 } 
    }));

    // 2.1 Đáp án Trắc nghiệm
    if (examData?.trac_nghiem && examData.trac_nghiem.length > 0) {
        docChildren.push(new Paragraph({ text: "I. TRẮC NGHIỆM", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }));
        const tnAnswers = examData.trac_nghiem.map(cau => `${cau.cau_so}.${cau.dap_an_dung || "?"}`).join("   |   ");
        docChildren.push(new Paragraph({ text: tnAnswers, spacing: { after: 400 } }));
    }

    // 2.2 Đáp án Tự luận (Đã sửa lỗi quét linh hoạt)
    if (examData?.tu_luan && examData.tu_luan.length > 0) {
        docChildren.push(new Paragraph({ text: "II. TỰ LUẬN", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }));
        
        examData.tu_luan.forEach((cau) => {
            docChildren.push(new Paragraph({ 
                children: [new TextRun({ text: `Câu ${cau.cau_so}:`, bold: true })],
                spacing: { before: 150, after: 50 }
            }));
            
            const hdCham = cau.huong_dan_cham || cau.dap_an || cau.huong_dan_giai;
            
            if (hdCham) {
                if (Array.isArray(hdCham)) {
                    hdCham.forEach((buoc) => {
                        if (typeof buoc === 'string') {
                            docChildren.push(new Paragraph({ text: `- ${buoc}`, spacing: { before: 40, after: 40 } }));
                        } else if (typeof buoc === 'object' && buoc !== null) {
                            const noiDung = buoc.buoc || buoc.noi_dung || buoc.noi_dung_buoc || buoc.chi_tiet || JSON.stringify(buoc);
                            const diem = (buoc.diem || buoc.diem_thanh_phan) ? ` (${buoc.diem || buoc.diem_thanh_phan} điểm)` : "";
                            docChildren.push(new Paragraph({ text: `- ${noiDung}${diem}`, spacing: { before: 40, after: 40 } }));
                        }
                    });
                } else if (typeof hdCham === 'string') {
                    // Nếu AI trả về đoạn văn bản có nhiều dòng
                    const lines = hdCham.split('\n');
                    lines.forEach(line => {
                        if (line.trim()) {
                            docChildren.push(new Paragraph({ text: line.trim(), spacing: { before: 40, after: 40 } }));
                        }
                    });
                }
            } else {
                docChildren.push(new Paragraph({ 
                    text: "- Học sinh trình bày đúng các ý trọng tâm theo kiến thức bài học.", 
                    italics: true, 
                    spacing: { before: 40, after: 40 } 
                }));
            }
        });
    }

    const doc = new Document({ sections: [{ properties: {}, children: docChildren }] });
    return await Packer.toBuffer(doc);
}

// ==========================================
// API ENDPOINTS
// ==========================================

// API 1: Sinh đề JSON để Web xem trước
app.post('/api/generate-exam', async (req, res) => {
    try {
        const { monHoc, lop, chuDe, soCauTN, soCauTL } = req.body;
        
        // Sử dụng model lite chạy mượt, không lo nghẽn mạng
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.5-flash-lite", 
            generationConfig: { responseMimeType: "application/json" } 
        });
        
        const prompt = `Bạn là chuyên gia giáo dục. Hãy tạo một đề kiểm tra hoàn chỉnh:
        - Môn: ${monHoc}, Lớp: ${lop}
        - Chủ đề: ${chuDe}
        - Cấu trúc: ${soCauTN} câu trắc nghiệm, ${soCauTL} câu tự luận.
        
        YÊU CẦU BẮT BUỘC:
        1. Sử dụng tiếng Việt có dấu chuẩn xác 100% cho mọi câu hỏi, đáp án và lời giải.
        2. Phần tự luận BẮT BUỘC phải có hướng dẫn chấm chi tiết và phân bố điểm rõ ràng.
        3. Không sử dụng mã công thức LaTeX.
        
        Cấu trúc JSON yêu cầu:
        {
          "thong_tin_chung": { "mon_hoc": "...", "lop": "...", "chu_de": "...", "thoi_gian_lam_bai": "45 phút" },
          "trac_nghiem": [
            { "cau_so": 1, "noi_dung": "...", "lua_chon": { "A": "...", "B": "...", "C": "...", "D": "..." }, "dap_an_dung": "A", "muc_do": "..." }
          ],
          "tu_luan": [
            { 
              "cau_so": 1, 
              "noi_dung": "...", 
              "huong_dan_cham": [
                { "buoc": "Nêu được ý chính 1...", "diem": 1.0 },
                { "buoc": "Nêu được ý chính 2...", "diem": 1.0 }
              ] 
            }
          ]
        }`;

        console.log(`Đang sinh đề môn ${monHoc}...`);
        const result = await model.generateContent(prompt);
        
        let rawText = result.response.text();
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonOutput = JSON.parse(rawText);
        
        res.json(jsonOutput);

    } catch (error) {
        console.error("Lỗi API 1:", error);
        res.status(500).json({ error: "Lỗi tạo đề thi." });
    }
});

// API 2: Nhận JSON từ Web và xuất file Word
app.post('/api/download-word', async (req, res) => {
    try {
        const { examData } = req.body;
        console.log("Đang đóng gói file Word có đầy đủ đề thi và đáp án...");
        const wordBuffer = await createWordBuffer(examData);

        res.setHeader('Content-Disposition', `attachment; filename=De_Kiem_Tra.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(wordBuffer);
    } catch (error) {
        console.error("Lỗi API 2:", error);
        res.status(500).json({ error: "Lỗi xuất file Word." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server Backend đang chạy tại http://localhost:${PORT}`));
module.exports = app;