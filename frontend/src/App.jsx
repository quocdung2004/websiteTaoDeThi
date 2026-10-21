import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ monHoc: 'Lịch sử', lop: '9', chuDe: 'Chiến tranh thế giới thứ hai', soCauTN: 5, soCauTL: 2 });
  const [isLoading, setIsLoading] = useState(false);
  const [examData, setExamData] = useState(null); // Lưu dữ liệu để xem trước

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Nút 1: Lấy JSON từ AI để xem trước
  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setExamData(null);
    try {
      const response = await fetch('https://website-tao-de-thi.vercel.app/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Có lỗi xảy ra');
      const data = await response.json();
      setExamData(data); // Đẩy vào State để render ra màn hình
    } catch (error) {
      alert("Lỗi: Không thể tạo đề thi lúc này.");
    } finally {
      setIsLoading(false);
    }
  };

  // Nút 2: Gửi lại JSON xuống Server để lấy Word
  const handleDownloadWord = async () => {
    try {
      const response = await fetch('https://website-tao-de-thi.vercel.app/api/download-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examData }),
      });

      // THÊM ĐOẠN NÀY ĐỂ CHẶN FILE LỖI:
      if (!response.ok) {
        throw new Error('Lỗi xuất file từ Server');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `De_Kiem_Tra_${examData?.thong_tin_chung?.mon_hoc || 'AI'}.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("❌ Lỗi: Không thể xuất file Word. Dữ liệu từ AI bị khuyết thiếu!");
    }
  };

  return (
    <div className="container">
      <h1>🤖 AI Tạo Đề Kiểm Tra</h1>
      
      {!examData ? (
        <form onSubmit={handleGenerate} className="exam-form">
          <div className="form-group">
            <label>Môn học:</label>
            <select name="monHoc" value={formData.monHoc} onChange={handleChange}>
              <option value="Lịch sử">Lịch sử</option>
              <option value="Địa lí">Địa lí</option>
              <option value="Giáo dục công dân">Giáo dục công dân</option>
              <option value="Thể dục">Thể dục</option>

            </select>
          </div>
          <div className="form-group">
            <label>Lớp:</label>
            <input type="number" name="lop" value={formData.lop} onChange={handleChange} min="1" max="12" />
          </div>
          <div className="form-group">
            <label>Chủ đề:</label>
            <input type="text" name="chuDe" value={formData.chuDe} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số câu TN:</label>
              <input type="number" name="soCauTN" value={formData.soCauTN} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Số câu TL:</label>
              <input type="number" name="soCauTL" value={formData.soCauTL} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? '⏳ Đang sinh đề...' : '✨ Tạo Đề Thi'}
          </button>
        </form>
      ) : (
        <div className="preview-container">
          <div className="preview-header">
            <button onClick={() => setExamData(null)} className="back-btn">⬅ Trở lại</button>
            <button onClick={handleDownloadWord} className="download-btn">📥 Tải Word (Có Đáp án)</button>
          </div>
          
          <div className="preview-content">
            <h2 className="text-center">ĐỀ KIỂM TRA MÔN {examData.thong_tin_chung?.mon_hoc?.toUpperCase()} - LỚP {examData.thong_tin_chung?.lop}</h2>
            
            {/* 1. HIỂN THỊ ĐỀ TRẮC NGHIỆM */}
            {examData.trac_nghiem?.length > 0 && (
              <>
                <h3>I. TRẮC NGHIỆM</h3>
                {examData.trac_nghiem.map(cau => (
                  <div key={cau.cau_so} className="question">
                    <p><strong>Câu {cau.cau_so}:</strong> {cau.noi_dung}</p>
                    <ul>
                      {cau.lua_chon && Object.entries(cau.lua_chon).map(([key, value]) => (
                        <li key={key}><strong>{key}.</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}

            {/* 2. HIỂN THỊ ĐỀ TỰ LUẬN */}
            {examData.tu_luan?.length > 0 && (
              <>
                <h3>II. TỰ LUẬN</h3>
                {examData.tu_luan.map(cau => (
                  <div key={cau.cau_so} className="question">
                    <p><strong>Câu {cau.cau_so}:</strong> {cau.noi_dung}</p>
                  </div>
                ))}
              </>
            )}

            {/* 3. HIỂN THỊ HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN (PHẦN MỚI) */}
            <hr style={{ margin: '40px 0', borderTop: '2px dashed #ccc' }} />
            <h2 className="text-center" style={{ color: '#d93025' }}>HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN</h2>
            
            {examData.trac_nghiem?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#1a73e8' }}>I. TRẮC NGHIỆM</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  {examData.trac_nghiem.map(cau => (
                    <span key={cau.cau_so} style={{ marginRight: '15px', padding: '4px 8px', background: '#e8f0fe', borderRadius: '4px' }}>
                      <strong>{cau.cau_so}.</strong> {cau.dap_an_dung || '?'}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {examData.tu_luan?.length > 0 && (
              <div>
                <h3 style={{ color: '#1a73e8' }}>II. TỰ LUẬN</h3>
                {examData.tu_luan.map(cau => (
                  <div key={cau.cau_so} className="question">
                    <p><strong>Câu {cau.cau_so}:</strong></p>
                    {cau.huong_dan_cham ? (
                      Array.isArray(cau.huong_dan_cham) ? (
                        <ul>
                          {cau.huong_dan_cham.map((buoc, index) => (
                            <li key={index}>
                              {buoc.buoc || buoc.noi_dung || (typeof buoc === 'string' ? buoc : "Gợi ý chấm")} 
                              {buoc.diem ? ` (${buoc.diem} điểm)` : ""}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{cau.huong_dan_cham}</p>
                      )
                    ) : (
                      <p style={{ fontStyle: 'italic', color: '#666' }}>
                        (AI không sinh chi tiết hướng dẫn chấm cho câu này do giới hạn của model Lite. Giáo viên tự chấm theo ý.)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;