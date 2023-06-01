

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" >
      <body className="">
       {children}
      </body>
    </html>
  );
}
