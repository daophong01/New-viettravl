import { Router } from "express";
import PDFDocument from "pdfkit";
import { requireAuth } from "../middleware/auth.js";
import { Payment, Booking, Tour, User } from "../models/index.js";

const router = Router();

function hasRole(req: any, roles: string[]) {
  const r = (req.user?.role || "").toLowerCase();
  return roles.map((x) => x.toLowerCase()).includes(r);
}

// Revenue PDF report
router.get("/revenue.pdf", requireAuth, async (req: any, res) => {
  if (!hasRole(req, ["admin", "superadmin", "financeadmin"])) return res.status(403).json({ error: "Forbidden" });

  const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : null;
  const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : null;

  const payments = await Payment.findAll({
    where: { status: "succeeded" } as any,
    order: [["createdAt", "ASC"]],
  });

  const rows = payments.filter((p: any) => {
    const created = new Date(p.createdAt);
    if (startDate && created < startDate) return false;
    if (endDate && created > endDate) return false;
    return true;
  });

  const total = rows.reduce((sum, p) => sum + (p.amount || 0), 0);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=revenue_report.pdf");

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res as any);

  doc.fontSize(18).text("Báo cáo doanh thu", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Khoảng thời gian: ${startDate ? startDate.toLocaleDateString("vi-VN") : "—"} đến ${endDate ? endDate.toLocaleDateString("vi-VN") : "—"}`);
  doc.moveDown();

  doc.text(`Tổng giao dịch: ${rows.length}`);
  doc.text(`Tổng doanh thu: ${total.toLocaleString("vi-VN")} VND`);
  doc.moveDown();

  doc.text("Chi tiết giao dịch:");
  doc.moveDown(0.5);

  rows.forEach((p) => {
    doc.text(
      `#${p.id} • ${new Date((p as any).createdAt).toLocaleString("vi-VN")} • Tour #${p.tourId ?? "-"} • Người dùng #${p.userId ?? "-"} • ${p.amount?.toLocaleString("vi-VN")} VND • ${p.paymentMethod?.toUpperCase() || "N/A"}`
    );
  });

  doc.end();
});

// Booking invoice PDF
router.get("/invoice/:id.pdf", requireAuth, async (req: any, res) => {
  if (!hasRole(req, ["admin", "superadmin", "tourmanager", "financeadmin"])) return res.status(403).json({ error: "Forbidden" });

  const id = Number(req.params.id);
  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ error: "Not found" });
  const user = booking.userId ? await User.findByPk(booking.userId) : null;
  const tour = booking.tourId ? await Tour.findByPk(booking.tourId) : null;
  const payment = await Payment.findOne({ where: { userId: booking.userId, tourId: booking.tourId, status: "succeeded" } });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice_${id}.pdf`);

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res as any);

  doc.fontSize(18).text("Hóa đơn đặt tour", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Mã đơn: #${booking.id}`);
  doc.text(`Ngày đặt: ${booking.bookedAt ? new Date(booking.bookedAt as any).toLocaleString("vi-VN") : "—"}`);
  doc.text(`Trạng thái: ${booking.status}`);
  doc.text(`Thanh toán: ${booking.paymentStatus}`);
  doc.moveDown();

  doc.text(`Khách hàng: ${user ? `${user.name} (${user.email})` : `#${booking.userId}`}`);
  doc.text(`Tour: ${tour ? `${tour.title} (${tour.location})` : `#${booking.tourId}`}`);
  doc.text(`Ngày khởi hành: ${booking.departureDate ? new Date(booking.departureDate as any).toLocaleDateString("vi-VN") : "—"}`);
  doc.moveDown();

  const amount = payment?.amount || tour?.price || 0;
  doc.text(`Số tiền: ${Number(amount).toLocaleString("vi-VN")} VND`);
  doc.text(`Phương thức: ${payment?.paymentMethod?.toUpperCase() || "N/A"}`);
  doc.text(`Mã phiên: ${payment?.sessionId || "—"}`);
  doc.moveDown(2);

  doc.text("Cảm ơn bạn đã sử dụng dịch vụ của TravelGo!", { align: "center" });

  doc.end();
});

export default router;