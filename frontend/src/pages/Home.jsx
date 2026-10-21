import TestForm from "../components/TestForm";

function Home() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="brand">
            <div className="brand-icon">AI</div>

            <div>
              <h1>AI Test Generator</h1>
              <p>Trợ lý tạo bài kiểm tra</p>
            </div>
          </div>

          <div className="header-badge">
            ✨ AI hỗ trợ giáo viên
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main-container">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">AI EDUCATION ASSISTANT</span>

            <h2>
              Tạo bài kiểm tra
              <br />
              <span>nhanh chóng với AI</span>
            </h2>

            <p>
              Nhập yêu cầu của bạn, AI sẽ hỗ trợ xây dựng bài kiểm tra,
              đáp án và hướng dẫn chấm phù hợp với nội dung giảng dạy.
            </p>
          </div>
        </section>

        {/* Form */}
        <TestForm />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          AI Test Generator • Công cụ hỗ trợ giáo viên xây dựng bài kiểm tra
        </p>
      </footer>
    </div>
  );
}

export default Home;