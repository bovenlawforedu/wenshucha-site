// 文书查 · 演示数据层
// ⚠️ 当前为演示假数据（isDemo = true），用于原型/开发阶段走通交互。
// 后续接入真实全量数据时：只改 src/lib/api.ts 的内部实现，本文件与页面代码零改动。

export interface CaseItem {
  no: string;        // 案号
  court: string;     // 法院
  date: string;      // 判决日期
  level: '基层法院' | '中级法院' | '高级法院';
  prog: '一审' | '二审' | '再审';
  year: string;
  result: string;    // 裁判结果
  snip: string;      // 摘要片段
  cite: string;      // 原文回链
}

export interface DistRow { name: string; val: number; cls?: '' | 'o' | 'g'; }

export interface CaseData {
  key: string;
  total: number;     // 相关文书总量
  comp: string;      // 常见判赔区间
  days: string;      // 平均审结周期
  dist: DistRow[];   // 判决结果分布
  level: DistRow[];  // 法院层级分布
  region: DistRow[]; // 地域分布
  items: CaseItem[];
}

export const isDemo = true; // 标记：演示数据

export const CASES: Record<string, CaseData> = {
  "机动车交通事故责任纠纷": {
    key: "机动车交通事故责任纠纷", total: 124320, comp: "2.8万 ~ 18.6万", days: "平均 126 天",
    dist: [["支持原判",62,""],["部分改判",37,"o"],["发回重审",1,"g"]].map(([name,val,cls]) => ({name:name as string, val:val as number, cls: cls as ''|'o'|'g'})),
    level: [["基层法院",71],["中级法院",24],["高级法院",5]].map(([name,val]) => ({name:name as string, val:val as number})),
    region: [["广东",32],["江苏",18],["浙江",15],["北京",12],["其他",23]].map(([name,val]) => ({name:name as string, val:val as number})),
    items: [
      {no:"(2025)粤01民终4521号", court:"广东省广州市中级人民法院", date:"2025-08-12", level:"中级法院", prog:"二审", year:"2025", result:"维持原判", snip:"经审理认为，一审判决认定的医疗费、误工费、护理费金额并无不当。关于精神损害抚慰金，酌定支持 8000 元……", cite:"https://wenshu.court.gov.cn/detail?no=2025yue01mz4521"},
      {no:"(2025)粤0305民初8923号", court:"广东省深圳市南山区人民法院", date:"2025-07-30", level:"基层法院", prog:"一审", year:"2025", result:"支持部分诉讼请求", snip:"被告负事故主要责任，原告主张的车辆维修费 4.2 万元予以支持；误工费按月收入 1.1 万元、误工期 60 天计算……", cite:"https://wenshu.court.gov.cn/detail?no=2025yue0305cz8923"},
      {no:"(2024)粤民再11号", court:"广东省高级人民法院", date:"2024-11-05", level:"高级法院", prog:"再审", year:"2024", result:"发回重审", snip:"原审对交强险与商业三者险的赔付顺序认定错误，导致责任比例分配不当，依法发回原审法院重审……", cite:"https://wenshu.court.gov.cn/detail?no=2024yueminzai11"},
      {no:"(2025)苏05民终3310号", court:"江苏省苏州市中级人民法院", date:"2025-06-18", level:"中级法院", prog:"二审", year:"2025", result:"改判", snip:"受害人构成十级伤残，一审未支持被扶养人生活费，属适用法律错误，本院予以纠正，改判增加赔偿 3.1 万元……", cite:"https://wenshu.court.gov.cn/detail?no=2025su05mz3310"}
    ]
  },
  "劳动合同纠纷": {
    key: "劳动合同纠纷", total: 86340, comp: "1.2万 ~ 9.8万", days: "平均 98 天",
    dist: [["支持原判",58,""],["部分改判",34,"o"],["发回重审",8,"g"]].map(([name,val,cls]) => ({name:name as string, val:val as number, cls: cls as ''|'o'|'g'})),
    level: [["基层法院",78],["中级法院",19],["高级法院",3]].map(([name,val]) => ({name:name as string, val:val as number})),
    region: [["广东",28],["上海",20],["北京",17],["浙江",12],["其他",23]].map(([name,val]) => ({name:name as string, val:val as number})),
    items: [
      {no:"(2025)沪01民终5521号", court:"上海市第一中级人民法院", date:"2025-08-02", level:"中级法院", prog:"二审", year:"2025", result:"维持原判", snip:"公司以末位淘汰为由解除劳动合同缺乏法律依据，属于违法解除，一审判付经济赔偿金 6.8 万元并无不当……", cite:"https://wenshu.court.gov.cn/detail?no=2025hu01mz5521"},
      {no:"(2025)京0108民初7731号", court:"北京市海淀区人民法院", date:"2025-07-15", level:"基层法院", prog:"一审", year:"2025", result:"支持部分诉讼请求", snip:"未签书面劳动合同，应当支付二倍工资差额；加班费主张因缺乏考勤记录佐证，酌情部分支持……", cite:"https://wenshu.court.gov.cn/detail?no=2025jing0108cz7731"},
      {no:"(2024)粤03民终9912号", court:"广东省深圳市中级人民法院", date:"2024-12-20", level:"中级法院", prog:"二审", year:"2024", result:"改判", snip:"竞业限制经济补偿计算基数应含提成与奖金，原审仅按基本工资计算，本院予以纠正……", cite:"https://wenshu.court.gov.cn/detail?no=2024yue03mz9912"},
      {no:"(2025)浙01民终1188号", court:"浙江省杭州市中级人民法院", date:"2025-05-28", level:"中级法院", prog:"二审", year:"2025", result:"维持原判", snip:"工伤职工停工留薪期工资属于劳动报酬，用人单位未足额支付，应补足差额并支付逾期利息……", cite:"https://wenshu.court.gov.cn/detail?no=2025zhe01mz1188"}
    ]
  },
  "民间借贷纠纷": {
    key: "民间借贷纠纷", total: 152700, comp: "5千 ~ 50万", days: "平均 84 天",
    dist: [["支持原判",66,""],["部分改判",29,"o"],["发回重审",5,"g"]].map(([name,val,cls]) => ({name:name as string, val:val as number, cls: cls as ''|'o'|'g'})),
    level: [["基层法院",81],["中级法院",16],["高级法院",3]].map(([name,val]) => ({name:name as string, val:val as number})),
    region: [["浙江",24],["广东",22],["江苏",16],["四川",11],["其他",27]].map(([name,val]) => ({name:name as string, val:val as number})),
    items: [
      {no:"(2025)浙0102民初3312号", court:"浙江省杭州市上城区人民法院", date:"2025-08-20", level:"基层法院", prog:"一审", year:"2025", result:"支持部分诉讼请求", snip:"双方借贷关系成立，借款本金 20 万元应予返还；约定利率超出法定上限部分，依法调整为 LPR 四倍……", cite:"https://wenshu.court.gov.cn/detail?no=2025zhe0102cz3312"},
      {no:"(2025)粤03民终7765号", court:"广东省深圳市中级人民法院", date:"2025-07-08", level:"中级法院", prog:"二审", year:"2025", result:"改判", snip:"转账凭证不能当然认定为借款，但结合聊天记录与还款承诺，借贷合意成立，原审认定本金数额有误，予以纠正……", cite:"https://wenshu.court.gov.cn/detail?no=2025yue03mz7765"},
      {no:"(2024)京01民终8842号", court:"北京市第一中级人民法院", date:"2024-10-16", level:"中级法院", prog:"二审", year:"2024", result:"维持原判", snip:"夫妻一方以个人名义所负超出家庭日常需要的债务，债权人未能证明用于共同生活，不认定为夫妻共同债务……", cite:"https://wenshu.court.gov.cn/detail?no=2024jing01mz8842"},
      {no:"(2025)苏05民初110号", court:"江苏省苏州市中级人民法院", date:"2025-03-11", level:"中级法院", prog:"一审", year:"2025", result:"支持诉讼请求", snip:"被告经合法传唤无正当理由拒不到庭，视为放弃答辩与举证权利，原告主张的借款本息予以支持……", cite:"https://wenshu.court.gov.cn/detail?no=2025su05cz110"}
    ]
  },
  "建设工程施工合同纠纷": {
    key: "建设工程施工合同纠纷", total: 41200, comp: "15万 ~ 420万", days: "平均 210 天",
    dist: [["支持原判",54,""],["部分改判",38,"o"],["发回重审",8,"g"]].map(([name,val,cls]) => ({name:name as string, val:val as number, cls: cls as ''|'o'|'g'})),
    level: [["基层法院",62],["中级法院",33],["高级法院",5]].map(([name,val]) => ({name:name as string, val:val as number})),
    region: [["江苏",20],["广东",18],["山东",14],["四川",12],["其他",36]].map(([name,val]) => ({name:name as string, val:val as number})),
    items: [
      {no:"(2025)苏04民终2281号", court:"江苏省常州市中级人民法院", date:"2025-08-05", level:"中级法院", prog:"二审", year:"2025", result:"部分改判", snip:"案涉工程经竣工验收合格，承包方主张的工程款应予支持；但利息起算点应按竣工结算文件提交之日起算……", cite:"https://wenshu.court.gov.cn/detail?no=2025su04mz2281"},
      {no:"(2025)粤06民初142号", court:"广东省佛山市中级人民法院", date:"2025-06-24", level:"中级法院", prog:"一审", year:"2025", result:"支持诉讼请求", snip:"发包人未按约支付进度款，承包方停工催告后解除合同，主张已完工部分工程款及逾期付款利息，予以支持……", cite:"https://wenshu.court.gov.cn/detail?no=2025yue06cz142"},
      {no:"(2024)川01民终6618号", court:"四川省成都市中级人民法院", date:"2024-11-29", level:"中级法院", prog:"二审", year:"2024", result:"维持原判", snip:"实际施工人突破合同相对性向发包人主张权利，须以发包人欠付工程款范围为限，原审认定正确……", cite:"https://wenshu.court.gov.cn/detail?no=2024chuan01mz6618"},
      {no:"(2025)鲁02民终4477号", court:"山东省青岛市中级人民法院", date:"2025-04-16", level:"中级法院", prog:"二审", year:"2025", result:"发回重审", snip:"一审对已付工程款的举证责任分配不当，未组织对账，导致基本事实不清，裁定发回重审……", cite:"https://wenshu.court.gov.cn/detail?no=2025lu02mz4477"}
    ]
  },
  "侵害商标权纠纷": {
    key: "侵害商标权纠纷", total: 28600, comp: "1万 ~ 60万", days: "平均 140 天",
    dist: [["支持原判",61,""],["部分改判",32,"o"],["发回重审",7,"g"]].map(([name,val,cls]) => ({name:name as string, val:val as number, cls: cls as ''|'o'|'g'})),
    level: [["基层法院",55],["中级法院",40],["高级法院",5]].map(([name,val]) => ({name:name as string, val:val as number})),
    region: [["广东",26],["浙江",19],["北京",15],["上海",13],["其他",27]].map(([name,val]) => ({name:name as string, val:val as number})),
    items: [
      {no:"(2025)粤73民初2210号", court:"广州知识产权法院", date:"2025-08-18", level:"中级法院", prog:"一审", year:"2025", result:"支持部分诉讼请求", snip:"被告在相同商品上使用近似标识，构成商标侵权；考虑商标知名度与侵权情节，酌定赔偿 25 万元并停止侵权……", cite:"https://wenshu.court.gov.cn/detail?no=2025yue73cz2210"},
      {no:"(2025)京73民终3391号", court:"北京知识产权法院", date:"2025-07-22", level:"中级法院", prog:"二审", year:"2025", result:"改判", snip:"合法来源抗辩成立，销售商不承担赔偿责任，但应停止销售；原审判令销售商连带赔偿，适用法律有误……", cite:"https://wenshu.court.gov.cn/detail?no=2025jing73mz3391"},
      {no:"(2024)沪73民终1182号", court:"上海知识产权法院", date:"2024-12-03", level:"中级法院", prog:"二审", year:"2024", result:"维持原判", snip:"将他人注册商标设置为搜索关键词并用于商业推广，构成商标性使用，侵犯注册商标专用权……", cite:"https://wenshu.court.gov.cn/detail?no=2024hu73mz1182"},
      {no:"(2025)浙0110民初6631号", court:"浙江省杭州市余杭区人民法院", date:"2025-05-09", level:"基层法院", prog:"一审", year:"2025", result:"支持诉讼请求", snip:"电商店铺商品链接标题含他人注册商标，构成侵权，综合店铺销量判赔 12 万元，含合理维权开支……", cite:"https://wenshu.court.gov.cn/detail?no=2025zhe0110cz6631"}
    ]
  }
};

export const CASE_KEYS: string[] = Object.keys(CASES);
export const DEFAULT_CASE: string = CASE_KEYS[0];
