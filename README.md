# Đề thi chọn đội tuyển Nghệ An 2026–2027 — Full đề & lời giải

Website editorial cho trọn bộ 7 bài, 2 ngày thi, 180 phút/ngày.

## Website

GitHub Pages: https://trinhtanphat.github.io/de-thi-chon-doi-tuyen-nghe-an-2026-2027/

## Nội dung

- `de-bai.html`: toàn văn đề bài đã đối chiếu lại với hai ảnh gốc người dùng cung cấp.
- `solutions/q1.html` … `solutions/q7.html`: lời giải chi tiết từng câu.
- `tools/geometry-core.js`: lõi hình học 2D dùng chung.
- `tools/q3-interactive.js`, `tools/q5-interactive.js`: dựng hình tương tác từ đúng định nghĩa, có residual kiểm chứng và xuất SVG.
- Câu 7 có mô phỏng vòng đèn tương tác.
- Công thức render bằng KaTeX; UI dùng Be Vietnam Pro, nội dung dùng Noto Serif, residual dùng JetBrains Mono.
- Giao diện có dark/light mode và hiệu ứng chiều sâu 3D nhẹ; hình học vẫn giữ 2D chính xác.

## Kết quả chính

- Câu 1: `lim x_n = 0`, `lim y_n = (d-1)/2`, và `sum x_n` hội tụ.
- Câu 2: nghiệm duy nhất `f(x)=x`.
- Câu 3: `YZ` qua trung điểm `AH`; `XA ⟂ XP`.
- Câu 4: dựng được dây chuyền vô hạn các số tốt và số ước nguyên tố phân biệt không bị chặn.
- Câu 5: `IR ⟂ AK`; `AK`, `BC` và đường Euler của tam giác `KBC` đồng quy hoặc đôi một song song.
- Câu 6: số hệ số khác 0 nhỏ nhất là `ceil(n/2)+1`.
- Câu 7: phần a iff `gcd(n,k)=1`; phần b, với `g=gcd(n,k)`, `m=n/g`, số bản ghi là `(2^m-1)^(g-1)(2^m+g-1)`.

## Kiểm tra trước khi phát hành

Chạy toàn bộ gate sau:

```powershell
python scripts\verify_site.py
python scripts\font_sanity.py
node scripts\renderer_sanity.mjs
node scripts\label_sanity.mjs
node scripts\q3_label_sanity.mjs
node scripts\q5_label_sanity.mjs
node scripts\geometry_sanity.mjs
python scripts\math_sanity.py
node scripts\browser_sanity.mjs
node scripts\layout_sanity.mjs
```

`q3_label_sanity.mjs` và `q5_label_sanity.mjs` dùng Edge/CDP với probe local độc lập CDN để kiểm tên điểm chỉ theo 4 hướng 90°, không đè cạnh/đường tròn/nhãn khác. `browser_sanity.mjs` là kiểm tra full-page bổ sung và có thể phụ thuộc CDN ngoài mạng. `layout_sanity.mjs` kiểm toàn bộ 9 trang ở 375/768/1200 px và fail nếu xuất hiện horizontal overflow.
