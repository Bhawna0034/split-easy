import { auth } from '@/auth'
import SplitEasyApp from '@/components/split-easy-app'
import { getDashboardData } from '@/lib/dashboard-data';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if(!session?.user?.id){
    redirect("/login");
  }

  const [data, currentUser] = await Promise.all([
    getDashboardData(session.user.id), prisma.user.findUnique({where: {id: session.user.id}})
    
  ]);
  return <SplitEasyApp  currentUserId = {session.user.id} currentUserName={currentUser?.name ?? "You"} {...data}/>
}
