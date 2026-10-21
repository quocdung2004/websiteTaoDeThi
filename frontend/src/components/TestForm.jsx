import { useState } from "react";

function TestForm() {
  const [formData, setFormData] = useState({
    educationLevel: "Tiểu học",
    grade: "5",
    subject: "Toán",
    textbook: "Kết nối tri thức với cuộc sống",
    topic: "",
    duration: 40,

    multipleChoice: 10,
    trueFalse: 0,
    shortAnswer: 0,
    essay: 3,

    recognition: true,
    understanding: true,
    application: true,
    advancedApplication: false,

    additionalRequirements: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Dữ liệu yêu cầu tạo đề:", formData);

    alert(
      "Thông tin đã được ghi nhận!\n\nBước tiếp theo chúng ta sẽ kết nối dữ liệu này với AI."
    );
  };

  return (
    <section className="test-form-card">
      <div className="section-heading">
        <div>
          <span className="section-label">BƯỚC 1</span>
          <h3>Thông tin bài kiểm tra</h3>
          <p>
            Hãy cung cấp các yêu cầu để AI xây dựng đề kiểm tra phù hợp.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Education level + Grade */}
        <div className="form-grid two-columns">
          <div className="form-group">
            <label htmlFor="educationLevel">
              Cấp học <span>*</span>
            </label>

            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
            >
              <option value="Tiểu học">Tiểu học</option>
              <option value="THCS">THCS</option>
              <option value="THPT">THPT</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="grade">
              Lớp <span>*</span>
            </label>

            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            >
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
              <option value="4">Lớp 4</option>
              <option value="5">Lớp 5</option>
              <option value="6">Lớp 6</option>
              <option value="7">Lớp 7</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        {/* Subject + Textbook */}
        <div className="form-grid two-columns">
          <div className="form-group">
            <label htmlFor="subject">
              Môn học <span>*</span>
            </label>

            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="Toán">Toán</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Ngữ văn">Ngữ văn</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Lịch sử và Địa lý">
                Lịch sử và Địa lý
              </option>
              <option value="Tin học">Tin học</option>
              <option value="Vật lý">Vật lý</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Sinh học">Sinh học</option>
              <option value="Công nghệ">Công nghệ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="textbook">Bộ sách / chương trình</label>

            <select
              id="textbook"
              name="textbook"
              value={formData.textbook}
              onChange={handleChange}
            >
              <option value="Kết nối tri thức với cuộc sống">
                Kết nối tri thức với cuộc sống
              </option>

              <option value="Chân trời sáng tạo">
                Chân trời sáng tạo
              </option>

              <option value="Cánh diều">Cánh diều</option>

              <option value="Chương trình riêng">
                Chương trình riêng
              </option>

              <option value="Không xác định">
                Không xác định
              </option>
            </select>
          </div>
        </div>

        {/* Topic */}
        <div className="form-group">
          <label htmlFor="topic">
            Phạm vi kiến thức <span>*</span>
          </label>

          <textarea
            id="topic"
            name="topic"
            rows="5"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Ví dụ: Phân số, số thập phân và các phép tính với số thập phân..."
          />

          <div className="input-hint">
            💡 Mô tả càng cụ thể, AI càng dễ xây dựng đề phù hợp.
          </div>
        </div>

        {/* Duration */}
        <div className="form-grid two-columns">
          <div className="form-group">
            <label htmlFor="duration">
              Thời gian làm bài <span>*</span>
            </label>

            <div className="input-with-unit">
              <input
                id="duration"
                name="duration"
                type="number"
                min="5"
                max="300"
                value={formData.duration}
                onChange={handleChange}
              />

              <span>phút</span>
            </div>
          </div>

          <div className="form-group">
            <label>Tổng số câu dự kiến</label>

            <div className="total-question">
              <strong>
                {Number(formData.multipleChoice) +
                  Number(formData.trueFalse) +
                  Number(formData.shortAnswer) +
                  Number(formData.essay)}
              </strong>

              <span>câu hỏi</span>
            </div>
          </div>
        </div>

        {/* Question types */}
        <div className="form-section">
          <div className="subsection-title">
            <h4>Cấu trúc bài kiểm tra</h4>
            <p>Chọn số lượng câu hỏi theo từng dạng.</p>
          </div>

          <div className="question-type-grid">
            <div className="question-type-card">
              <div className="question-type-header">
                <div className="question-icon">A</div>

                <div>
                  <strong>Trắc nghiệm</strong>
                  <span>Chọn một đáp án</span>
                </div>
              </div>

              <input
                type="number"
                name="multipleChoice"
                min="0"
                max="100"
                value={formData.multipleChoice}
                onChange={handleChange}
              />

              <small>câu</small>
            </div>

            <div className="question-type-card">
              <div className="question-type-header">
                <div className="question-icon">✓</div>

                <div>
                  <strong>Đúng / Sai</strong>
                  <span>Nhận định đúng hoặc sai</span>
                </div>
              </div>

              <input
                type="number"
                name="trueFalse"
                min="0"
                max="100"
                value={formData.trueFalse}
                onChange={handleChange}
              />

              <small>câu</small>
            </div>

            <div className="question-type-card">
              <div className="question-type-header">
                <div className="question-icon">?</div>

                <div>
                  <strong>Trả lời ngắn</strong>
                  <span>Học sinh tự trả lời</span>
                </div>
              </div>

              <input
                type="number"
                name="shortAnswer"
                min="0"
                max="100"
                value={formData.shortAnswer}
                onChange={handleChange}
              />

              <small>câu</small>
            </div>

            <div className="question-type-card">
              <div className="question-type-header">
                <div className="question-icon">✎</div>

                <div>
                  <strong>Tự luận</strong>
                  <span>Trình bày lời giải</span>
                </div>
              </div>

              <input
                type="number"
                name="essay"
                min="0"
                max="100"
                value={formData.essay}
                onChange={handleChange}
              />

              <small>câu</small>
            </div>
          </div>
        </div>

        {/* Cognitive levels */}
        <div className="form-section">
          <div className="subsection-title">
            <h4>Mức độ nhận thức</h4>
            <p>AI sẽ dựa vào các mức độ được chọn để phân bổ câu hỏi.</p>
          </div>

          <div className="level-grid">
            <label className="checkbox-card">
              <input
                type="checkbox"
                name="recognition"
                checked={formData.recognition}
                onChange={handleChange}
              />

              <span className="custom-checkbox"></span>

              <div>
                <strong>Nhận biết</strong>
                <small>Nhớ và nhận ra kiến thức</small>
              </div>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="understanding"
                checked={formData.understanding}
                onChange={handleChange}
              />

              <span className="custom-checkbox"></span>

              <div>
                <strong>Thông hiểu</strong>
                <small>Giải thích và hiểu kiến thức</small>
              </div>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="application"
                checked={formData.application}
                onChange={handleChange}
              />

              <span className="custom-checkbox"></span>

              <div>
                <strong>Vận dụng</strong>
                <small>Áp dụng kiến thức</small>
              </div>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="advancedApplication"
                checked={formData.advancedApplication}
                onChange={handleChange}
              />

              <span className="custom-checkbox"></span>

              <div>
                <strong>Vận dụng cao</strong>
                <small>Giải quyết vấn đề nâng cao</small>
              </div>
            </label>
          </div>
        </div>

        {/* Additional requirements */}
        <div className="form-group">
          <label htmlFor="additionalRequirements">
            Yêu cầu bổ sung
          </label>

          <textarea
            id="additionalRequirements"
            name="additionalRequirements"
            rows="4"
            value={formData.additionalRequirements}
            onChange={handleChange}
            placeholder="Ví dụ: Nội dung gần gũi với thực tế, không quá khó, có đáp án và hướng dẫn chấm chi tiết..."
          />
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="generate-button">
            <span>✨</span>
            Tạo bài kiểm tra bằng AI
          </button>

          <p>
            AI sẽ tạo đề kiểm tra, đáp án và hướng dẫn chấm dựa trên
            yêu cầu của bạn.
          </p>
        </div>
      </form>
    </section>
  );
}

export default TestForm;