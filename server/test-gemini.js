require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo Gemini (Nhớ thêm GEMINI_API_KEY vào file .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateExam() {
// Cập nhật tên model theo đúng gợi ý từ log lỗi
const model = genAI.getGenerativeModel({ model: "gemini-3.7-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `Bạn là chuyên gia giáo dục. Tạo đề kiểm tra:
    - Môn: Toán, Lớp: 9
    - Chủ đề: Hệ phương trình bậc nhất hai ẩn
    - Cấu trúc: 2 câu trắc nghiệm, 1 câu tự luận.
    Trình bày theo cấu trúc JSON gồm: thong_tin_chung, trac_nghiem (chứa cau_so, noi_dung, lua_chon A,B,C,D, dap_an_dung, muc_do), tu_luan (chứa cau_so, noi_dung, muc_do, huong_dan_cham), ma_tran.`;

    console.log("Đang gọi Gemini sinh đề...");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse thử JSON xem có chuẩn không
        const jsonOutput = JSON.parse(text);
        console.log("Thành công! Dữ liệu JSON thu được:");
        console.log(JSON.stringify(jsonOutput, null, 2));

    } catch (error) {
        console.error("Lỗi:", error);
    }
}

generateExam();