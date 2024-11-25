import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import MathComponent from '../MathComponent';

import './info.css';

function formatBackendData(input) {
  // Định dạng chuỗi dữ liệu
  let formatted = input.replace(/:\s*/g, ':\n'); // Xuống dòng sau dấu `:`
  formatted = formatted.replace(/\s*=>/g, '\n=>'); // Xuống dòng trước dấu `=>`
  formatted = formatted.replace(/Ta có:/g, '\nTa có:').trim(); // Thêm dòng trống giữa các đoạn
  return formatted;
}

function MyVerticallyCenteredModal(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Thành viên trong nhóm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>22520929 - Đặng Thanh Ngân</p>
        <p>22520424 - Thái Đình Nhật Hiển</p>
        <p>22521272 - Nguyễn Hồng Phát</p>
        <p>22521373 - Phạm Thanh Thảo</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Info = () => {
  const [giaThuyet, setGiaThuyet] = useState('');
  const [mucTieu, setMucTieu] = useState('');
  const [solution, setSolution] = useState(null);
  const [show, setShow] = useState(false);
  const [team, setTeam] = useState(false);
  const solutionRef = useRef(null);

  const handleStart = () => {
    setGiaThuyet('');
    setMucTieu('');
    setSolution(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ giaThuyet, mucTieu }),
      });

      if (response.ok) {
        const data = await response.json();
        setSolution(data.solution);
      } else {
        alert('Không thể giải bài toán. Vui lòng kiểm tra dữ liệu đầu vào!');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      alert('Đã xảy ra lỗi khi xử lý yêu cầu.');
    }
  };

  useEffect(() => {
    if (solution && solutionRef.current) {
      solutionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [solution]);

  return (
    <div className='info'>
      {/* Header */}
      <div className='bar'>
        <img src='Logo_Gr.svg' alt='' />
        <p>Contact us</p>
        <p>About</p>
        <p>Help</p>
        <button onClick={() => setTeam((prev) => !prev)}>Nhóm 10</button>
        <MyVerticallyCenteredModal show={team} onHide={() => setTeam(false)} />
      </div>

      {/* Main Content */}
      <div className='main'>
        <div className="logo">
          <img src='Logo_Gr.svg' alt='' />
          <p>Giải bài toán trong tam giác</p>
          <img className='rectangle' src='TamGiac.png' alt='Tam Giac' />
        </div>

        <div className="search">
          <Form onSubmit={handleSearch}>
            <Form.Group className="mb-2" controlId="formGiaThuyet">
              <Form.Label>Giả thuyết</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setGiaThuyet(e.target.value)}
                value={giaThuyet}
                placeholder="Nhập biến giả thuyết..."
              />
              <Form.Text className="text-muted">Ví dụ: A, B</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMucTieu">
              <Form.Label>Mục tiêu</Form.Label>
              <Form.Control
                type="text"
                value={mucTieu}
                onChange={(e) => setMucTieu(e.target.value)}
                placeholder="Nhập biến mục tiêu..."
              />
              <Form.Text className="text-muted">Ví dụ: C</Form.Text>
            </Form.Group>

            <div className="center-button">
              <Button className='restart' variant="primary" type="reset" onClick={handleStart}>
                Nhập lại
              </Button>
              <Button className='submit' variant="primary" type="submit">
                Giải
              </Button>
            </div>
          </Form>
        </div>

        {/* Solution Display */}
        {solution && (
          <div ref={solutionRef} className="result">
            <pre>{formatBackendData(solution)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
