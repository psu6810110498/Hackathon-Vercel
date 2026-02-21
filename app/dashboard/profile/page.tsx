import { auth } from "@/lib/auth/config";
import { getUserById } from "@/lib/db/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * User profile + subscription (Premium 199 THB/month)
 */
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserById(session.user.id);
  if (!user) return null;

  const isPremium = user.plan === "PREMIUM";

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-semibold">โปรไฟล์</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลบัญชี</CardTitle>
            <CardDescription>อีเมลและแผนการใช้งาน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.image && (
              <Image
                src={user.image}
                alt=""
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <p className="text-sm">
              <span className="text-muted-foreground">อีเมล: </span>
              {user.email}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">ชื่อ: </span>
              {user.name ?? "—"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">แผน: </span>
              {isPremium ? "Premium" : "ฟรี (3 ครั้ง/วัน)"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>อัปเกรดเป็น Premium</CardTitle>
            <CardDescription>วิเคราะห์ไม่จำกัด — 199 บาท/เดือน</CardDescription>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <p className="text-sm text-muted-foreground">คุณเป็นสมาชิก Premium แล้ว</p>
            ) : (
              <Button disabled>
                เปิดให้บริการเร็วๆ นี้
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
