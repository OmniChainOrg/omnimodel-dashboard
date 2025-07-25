// pages/api/test.ts
export default (req: any, res: any) => {
  console.log('Test endpoint hit');
  res.status(200).json({ working: true, body: req.body });
}
