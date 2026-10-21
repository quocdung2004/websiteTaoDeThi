require('dotenv').config();
const axios = require('axios'); // Dùng lại thư viện axios ta đã cài lúc nãy

async function checkModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY.trim();
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        
        console.log("Đang hỏi Google xem model nào đang online...");
        const response = await axios.get(url);
        
        console.log("\n✅ DANH SÁCH CÁC MODEL BẠN CÓ THỂ DÙNG NGAY LÚC NÀY:");
        response.data.models.forEach(model => {
            // Chỉ in ra các model hỗ trợ sinh text (generateContent)
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`👉 ${model.name.replace('models/', '')}`);
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách model:", error.message);
    }
}

checkModels();