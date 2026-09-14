# Đề thi chọn đội tuyển Nghệ An 2026–2027 — Full đề & lời giải

Website editorial cho trọn bộ 7 bài, 2 ngày thi, 180 phút/ngày.

## Nội dung

- `de-bai.html`: toàn văn đề bài từ hai ảnh gốc người dùng cung cấp.
- `solutions/q1.html` … `solutions/q7.html`: lời giải chi tiết từng câu.
- Câu 3 và Câu 5 có SVG hình học minh họa.
- Câu 7 có mô phỏng vòng đèn tương tác.
- Công thức render bằng KaTeX; giao diện có dark/light mode và hiệu ứng chiều sâu 3D nhẹ.

## Kết quả chính

- Câu 1: `lim x_n = 0`, `lim y_n = (d-1)/2`, và `sum x_n` hội tụ.
- Câu 2: nghiệm duy nhất `f(x)=x`.
- Câu 3: `YZ` qua trung điểm `AH`; `XA ⟂ XP`.
- Câu 4: dựng được dây chuyền vô hạn các số tốt và số ước nguyên tố phân biệt không bị chặn.
- Câu 6: số hệ số khác 0 nhỏ nhất là `ceil(n/2)+1`.
- Câu 7: phần a iff `gcd(n,k)=1`; phần b có công thức đóng theo `g=gcd(n,k)`.

## Kiểm tra

Chạy `python scripts/verify_site.py` và `python scripts/math_sanity.py` trước khi phát hành.