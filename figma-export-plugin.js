/**
 * Figma Plugin: Export AI Prototype Screens
 * ──────────────────────────────────────────
 * How to run:
 *   1. In Figma desktop app: Plugins → Development → New Plugin
 *   2. Choose "Run once", paste this entire file as the code
 *   3. Or: Plugins → Development → Open Console, paste & run
 *
 * Creates 4 frames on a new page:
 *   • Screen 1: Login
 *   • Screen 2: Chat
 *   • Screen 3: Agentic execution
 *   • Screen 4: New Task (Manus-style home)
 */

// ── Token aliases ──────────────────────────────────────────────────────────
const T = {
  bg:         { r:0.976, g:0.980, b:0.984 }, // #f9fafb
  bgAlt:      { r:0.953, g:0.957, b:0.961 }, // #f3f4f6
  bgManus:    { r:0.941, g:0.941, b:0.933 }, // #f0f0ee
  bgManusBar: { r:0.910, g:0.910, b:0.902 }, // #e8e8e6
  white:      { r:1,     g:1,     b:1     },
  gray50:     { r:0.980, g:0.980, b:0.980 },
  gray200:    { r:0.898, g:0.906, b:0.918 }, // #e5e7eb
  gray300:    { r:0.820, g:0.835, b:0.851 }, // #d1d5db
  gray400:    { r:0.612, g:0.639, b:0.678 }, // #9ca3af
  gray600:    { r:0.349, g:0.380, b:0.427 }, // #596170
  gray700:    { r:0.220, g:0.251, b:0.302 }, // #374151
  gray900:    { r:0.082, g:0.098, b:0.118 }, // #141519 ≈ #111827
  ink:        { r:0.082, g:0.082, b:0.075 }, // #141413
  cyan:       { r:0.227, g:0.784, b:0.859 }, // #3ac8db
  blue:       { r:0.145, g:0.388, b:0.922 }, // #2563eb
};

// ── Helpers ───────────────────────────────────────────────────────────────
function rgb(c){ return {r:c.r, g:c.g, b:c.b}; }
function solidFill(c){ return [{type:'SOLID', color:rgb(c)}]; }

async function frame(name, w, h){
  const f = figma.createFrame();
  f.name = name; f.resize(w, h);
  f.fills = solidFill(T.white);
  f.clipsContent = true;
  return f;
}

function rect(parent, name, x, y, w, h, fill, r=0){
  const n = figma.createRectangle();
  n.name = name; n.x = x; n.y = y;
  n.resize(w, h); n.fills = solidFill(fill);
  if(r) n.cornerRadius = r;
  parent.appendChild(n);
  return n;
}

async function text(parent, content, x, y, opts={}){
  const n = figma.createText();
  await figma.loadFontAsync({family: opts.family||'Inter', style: opts.style||'Regular'});
  n.characters = content;
  n.fontSize   = opts.size  || 14;
  n.fills      = solidFill(opts.color || T.gray900);
  if(opts.weight==='Medium')  await figma.loadFontAsync({family:'Inter',style:'Medium'}),  n.fontName={family:'Inter',style:'Medium'};
  if(opts.weight==='SemiBold')await figma.loadFontAsync({family:'Inter',style:'SemiBold'}),n.fontName={family:'Inter',style:'SemiBold'};
  if(opts.weight==='Bold')    await figma.loadFontAsync({family:'Inter',style:'Bold'}),    n.fontName={family:'Inter',style:'Bold'};
  n.x = x; n.y = y;
  parent.appendChild(n);
  return n;
}

function stroke(node, color, weight=1){
  node.strokes = [{type:'SOLID', color:rgb(color)}];
  node.strokeWeight = weight;
}

function shadow(node){
  node.effects = [{
    type:'DROP_SHADOW', color:{...rgb({r:.067,g:.067,b:.067}), a:.08},
    offset:{x:0,y:2}, radius:8, spread:0, visible:true, blendMode:'NORMAL'
  }];
}

// ── Shared components ─────────────────────────────────────────────────────
function drawSidebar(parent, W=280, H=900, activeLabel='Chats'){
  const sb = figma.createFrame();
  sb.name = 'Sidebar'; sb.x = 0; sb.y = 0;
  sb.resize(W, H); sb.fills = solidFill(T.bgAlt);
  parent.appendChild(sb);

  // Logo area
  rect(sb,'Logo BG',16,16,40,40,T.white,12);
  rect(sb,'Header Divider',0,72,W,1,T.gray200);

  const navItems = [
    {label:'New chat',  y:88},
    {label:'Chats',     y:128},
    {label:'Projects',  y:168},
    {label:'Artifacts', y:208},
    {label:'Code',      y:248},
  ];
  navItems.forEach(async item=>{
    const active = item.label===activeLabel;
    const bg = active ? T.gray200 : T.bgAlt;
    const r2 = rect(sb, item.label+(active?' [active]':''), 8, item.y, W-16, 36, bg, 8);
    await text(sb, item.label, 44, item.y+10, {size:14, color: active?T.gray900:T.gray700});
    rect(sb,'icon placeholder', 16, item.y+8, 20, 20, T.gray400, 4);
  });

  // Section label
  const sectionY = 300;
  rect(sb,'Section separator',0,sectionY,W,1,T.gray200);

  // Conversation items
  ['Make a Fairy Story','Springtime Poetry','Data Migration Plan',
   'Creating a Lesson Plan','API Documentation'].forEach(async (name,i)=>{
    const y = sectionY+8 + i*36;
    rect(sb,name+(i===0?' [active]':''), 8,y,W-16,32, i===0?T.gray200:T.bgAlt, 8);
    await text(sb, name, 16, y+8, {size:13, color:T.gray700});
  });

  // User footer
  rect(sb,'User footer', 0, H-56, W, 56, T.bgAlt);
  rect(sb,'Avatar',      16, H-44, 32, 32, T.cyan, 16);
  return sb;
}

function drawTitlebar(parent, parentW=1160, label='Claude 3.7 Sonnet'){
  const tb = figma.createFrame();
  tb.name='Titlebar'; tb.x=280; tb.y=0;
  tb.resize(parentW-280, 52); tb.fills=[{type:'SOLID',color:rgb(T.bgAlt),opacity:0}];
  parent.appendChild(tb);

  // Model button
  const mb = rect(tb,'Model button', (parentW-280)/2-80, 12, 160, 28, T.gray200, 8);
  text(tb, label, (parentW-280)/2-60, 18, {size:13, color:T.gray900, weight:'Medium'});

  // Action icons (right)
  rect(tb,'Action icon',parentW-280-72,14,28,28,T.bgAlt,8);
  rect(tb,'Avatar',     parentW-280-36,14,28,28,T.cyan,14);
  return tb;
}

function drawInputBar(parent, x, y, w){
  const bar = figma.createFrame();
  bar.name='Input bar'; bar.x=x; bar.y=y;
  bar.resize(w, 72); bar.fills=solidFill(T.white);
  bar.cornerRadius=20; shadow(bar); stroke(bar,T.gray200);
  parent.appendChild(bar);

  // Plus button
  rect(bar,'Plus btn',16,20,32,32,T.bgAlt,8);
  // Mic
  rect(bar,'Mic btn',w-108,20,32,32,T.white,16);
  const micStroke = rect(bar,'Mic stroke',w-108,20,32,32,T.white,16);
  stroke(micStroke, T.gray200);
  // Send
  rect(bar,'Send btn',w-68,20,28,28,T.gray900,9);
  return bar;
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — LOGIN
// ════════════════════════════════════════════════════════════════════════════
async function buildLogin(){
  const W=1440, H=1024;
  const f = await frame('Screen 1 · Login', W, H);
  f.fills = solidFill(T.bg);

  // Background blobs
  const b1 = figma.createEllipse();
  b1.name='Blob 1'; b1.x=-120; b1.y=-180; b1.resize(860,860);
  b1.fills=[{type:'SOLID',color:rgb(T.cyan),opacity:.08}];
  f.appendChild(b1);

  // Card
  const card = rect(f,'Login card', (W-480)/2, (H-520)/2, 480, 520, T.white, 24);
  shadow(card); stroke(card, T.gray200);

  // Logo
  rect(f,'Logo',  (W-40)/2, (H-520)/2+32, 40, 40, T.gray900, 12);

  // Headings
  await text(f,'登录注册',  (W-480)/2+48, (H-520)/2+100, {size:28, weight:'Bold', color:T.gray900});
  await text(f,'我行我上，你呢？', (W-480)/2+48, (H-520)/2+140, {size:14, color:T.gray400});

  // Feishu button
  const btn1 = rect(f,'Feishu btn', (W-480)/2+48, (H-520)/2+188, 384, 48, T.white, 10);
  stroke(btn1, T.gray300); shadow(btn1);
  await text(f,'飞书登陆', (W-480)/2+144, (H-520)/2+202, {size:14, weight:'Medium', color:T.gray900});

  // Divider
  rect(f,'Divider L', (W-480)/2+48,  (H-520)/2+252, 160, 1, T.gray200);
  rect(f,'Divider R', (W-480)/2+272, (H-520)/2+252, 160, 1, T.gray200);
  await text(f,'Or', W/2-8, (H-520)/2+244, {size:13, color:T.gray400});

  // Inputs
  const in1 = rect(f,'Username input', (W-480)/2+48, (H-520)/2+272, 384, 48, T.white, 10);
  stroke(in1, T.gray300);
  await text(f,'请输入用户名', (W-480)/2+64, (H-520)/2+286, {size:14, color:T.gray400});

  const in2 = rect(f,'Password input', (W-480)/2+48, (H-520)/2+332, 384, 48, T.white, 10);
  stroke(in2, T.gray300);
  await text(f,'请输入密码', (W-480)/2+64, (H-520)/2+346, {size:14, color:T.gray400});

  // Submit button
  const sub = rect(f,'Submit btn', (W-480)/2+48, (H-520)/2+396, 384, 48, T.gray300, 10);
  await text(f,'继续', (W-480)/2+48+164, (H-520)/2+410, {size:14, weight:'Medium', color:T.white});

  return f;
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — CHAT
// ════════════════════════════════════════════════════════════════════════════
async function buildChat(){
  const W=1440, H=1024;
  const f = await frame('Screen 2 · Chat', W, H);
  f.fills = solidFill(T.bgAlt);
  f.x = 1520;

  drawSidebar(f, 280, H, 'Chats');
  drawTitlebar(f, W);

  // Messages area
  const msgs = figma.createFrame();
  msgs.name='Messages'; msgs.x=280; msgs.y=52;
  msgs.resize(W-280, H-52-108); msgs.fills=solidFill(T.bg);
  f.appendChild(msgs);

  const MX=80, MW=Math.min(1000, W-280-160);

  // User bubble
  const ub = rect(msgs,'User bubble', MX, 40, 640, 60, T.bgAlt, 12);
  await text(msgs,'帮我用figma设计一个AI智能助手应用', MX+16, 40+18,
    {size:16, color:{r:.082,g:.082,b:.075}});

  // AI logo
  rect(msgs,'AI Logo 1', MX, 128, 32, 32, T.white, 9);
  stroke(msgs.children[msgs.children.length-1], T.gray200);

  // Task card
  const tc = rect(msgs,'Task card', MX+44, 120, 520, 100, T.white, 12);
  stroke(tc, T.gray200);
  await text(msgs,'分析需求 · 生成草图 · 导出设计稿', MX+60, 134, {size:13, color:T.gray700});

  // AI text
  await text(msgs,'好的！我来为你设计一个现代化的AI智能助手应用界面。', MX+44, 240,
    {size:14, color:T.gray900});
  await text(msgs,'以下是我的设计方案，包含登录页、主聊天界面和智能执行界面。', MX+44, 264,
    {size:14, color:T.gray700});

  // Thinking indicator
  const thk = rect(msgs,'Thinking', MX+44, 308, 220, 32, T.bgAlt, 8);
  rect(msgs,'Thinking icon', MX+52, 316, 16, 16, T.gray900, 4);
  await text(msgs,'Thinking deeply, stand by......', MX+76, 316,
    {size:12, color:T.gray400});

  // Input bar
  const ib = drawInputBar(f, 280+80, H-92, W-280-160);

  return f;
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — AGENTIC EXECUTION
// ════════════════════════════════════════════════════════════════════════════
async function buildAgent(){
  const W=1440, H=1024;
  const f = await frame('Screen 3 · Agentic', W, H);
  f.fills = solidFill(T.bgAlt);
  f.x = 3040;

  drawSidebar(f, 280, H, 'Projects');

  // Titlebar
  const tb2 = figma.createFrame();
  tb2.name='Titlebar'; tb2.x=280; tb2.y=0;
  tb2.resize(W-280,52); tb2.fills=[{type:'SOLID',color:rgb(T.bgAlt),opacity:0}];
  f.appendChild(tb2);
  await text(f,'Claude 3.7 Sonnet', 580, 16, {size:13,weight:'Medium',color:T.gray900});

  // Messages bg
  const msgs2 = figma.createFrame();
  msgs2.name='Agent messages'; msgs2.x=280; msgs2.y=52;
  msgs2.resize(W-280, H-52-108); msgs2.fills=solidFill(T.bg);
  f.appendChild(msgs2);

  const MX=80;
  // User message
  const ub2 = rect(msgs2,'User bubble',MX,40,540,60,T.bgAlt,12);
  await text(msgs2,'帮我搭建一个产品官网，要求现代简洁',MX+16,40+18,
    {size:16,color:{r:.082,g:.082,b:.075}});

  // AI logo 2
  rect(msgs2,'AI Logo',MX,128,32,32,T.white,9);
  stroke(msgs2.children[msgs2.children.length-1], T.gray200);

  // Task tracker card
  const ttc = rect(msgs2,'Task tracker',MX+44,120,640,180,T.white,16);
  stroke(ttc,{r:.945,g:.961,b:.976}); // #f1f5f9

  await text(msgs2,'建设官网',MX+64,136,{size:14,weight:'Medium',color:T.gray900});
  await text(msgs2,'2 / 4',MX+64,158,{size:12,color:T.gray400});

  // Step rows
  const steps=[
    {label:'分析需求文档',done:true, y:190},
    {label:'生成设计稿',  done:true, y:218},
    {label:'编写代码',    done:false,y:246},
    {label:'部署上线',    done:false,y:274},
  ];
  steps.forEach(async s=>{
    const ico = rect(msgs2,'Step ico',MX+64,s.y,16,16,
      s.done?T.cyan:{r:.9,g:.91,b:.92},8);
    await text(msgs2,s.label,MX+88,s.y,{size:13,color:s.done?T.gray900:T.gray400});
  });

  // Terminal card
  const term = rect(msgs2,'Terminal',MX+44,320,640,100,{r:.047,g:.047,b:.047},12);
  await text(msgs2,'[14:23:01] Scaffolding component tree...',MX+60,334,
    {size:12,color:{r:.4,g:.9,b:.85}});
  await text(msgs2,'[14:23:02] Loading design tokens...',MX+60,354,
    {size:12,color:{r:.5,g:.5,b:.5}});

  // Input bar
  drawInputBar(f, 280+80, H-92, W-280-160);
  return f;
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — NEW TASK (Manus-style)
// ════════════════════════════════════════════════════════════════════════════
async function buildNewTask(){
  const W=1440, H=1024;
  const f = await frame('Screen 4 · New Task', W, H);
  f.fills = solidFill(T.bgManus);
  f.x = 4560;

  // Manus sidebar
  const ms = figma.createFrame();
  ms.name='Manus Sidebar'; ms.x=0; ms.y=0;
  ms.resize(248,H); ms.fills=solidFill(T.bgManusBar);
  f.appendChild(ms);

  // Logo row
  rect(ms,'Logo icon',14,16,22,17,T.gray900,3);
  await text(ms,'manus',44,18,{size:15,weight:'SemiBold',color:T.gray900});

  // Nav items
  const navMs=[
    {label:'新建任务',active:true},
    {label:'Agents',badge:'新'},
    {label:'搜索'},
    {label:'库'},
  ];
  navMs.forEach(async (item,i)=>{
    const y=60+i*40;
    const bg=item.active?{r:.835,g:.835,b:.824}:T.bgManusBar; // #d4d4d2
    rect(ms,item.label+(item.active?' [active]':''),10,y,228,36,bg,9);
    await text(ms,item.label,44,y+10,{size:14,color:item.active?T.gray900:T.gray700,
      weight:item.active?'Medium':'Regular'});
    rect(ms,'icon',14,y+8,20,20,T.gray400,5);
    if(item.badge){
      const bdg=rect(ms,'badge',108,y+10,22,16,T.blue,4);
      await text(ms,item.badge,111,y+11,{size:10,color:T.white,weight:'Bold'});
    }
  });

  // Projects section
  await text(ms,'项目',14,232,{size:11,weight:'Bold',color:T.gray400});
  rect(ms,'Project icon',14,252,16,16,T.gray400,4);
  await text(ms,'体验设计',36,252,{size:13,color:T.gray700});

  // Tasks section
  await text(ms,'所有任务',14,288,{size:11,weight:'Bold',color:T.gray400});
  const tasks=[
    'Manus更新日志视频如何制作',
    '近3年AI产品设计系统及竞品汇总',
    '中国除夕家庭春节晚会PPT设计方案',
    '开发电商AI试穿App实现照片穿搭...',
    '创建POIZON Design设计系统网站...',
    '2026年AI设计验收工具调研与优化...',
    'Manus测评方法建议及报告大纲',
    '更换场景为高级餐厅保留向日葵甜品',
    '通用AI应用界面设计参考Manus交...',
  ];
  const taskColors=[T.blue,{r:.855,g:.647,b:.125},{r:.859,g:.153,b:.467},
    {r:.086,g:.643,b:.255},{r:.486,g:.227,b:.929},{r:.918,g:.345,b:.015},
    T.blue,{r:.855,g:.647,b:.125},{r:.859,g:.153,b:.467}];
  const taskBgs=[{r:.910,g:.957,b:1},{r:.996,g:.953,b:.765},{r:.988,g:.906,b:.953},
    {r:.941,g:.992,b:.957},{r:.929,g:.914,b:1},{r:1,g:.969,b:.929},
    {r:.910,g:.957,b:1},{r:.996,g:.953,b:.765},{r:.988,g:.906,b:.953}];
  tasks.forEach(async (name,i)=>{
    const y=312+i*36;
    rect(ms,'Task ico',10,y+8,20,20,taskBgs[i]||T.bgAlt,5);
    await text(ms,name,36,y+9,{size:12,color:T.gray700});
  });

  // Referral card
  const ref=rect(ms,'Referral card',10,H-120,228,68,T.white,12);
  stroke(ref,T.gray200);
  await text(ms,'与好友分享 Manus',22,H-110,{size:12,weight:'Medium',color:T.gray900});
  await text(ms,'各得 500 积分',22,H-92,{size:11,color:T.gray400});

  // Bottom footer icons
  const footIcons=['设置','设备','布局','侧边'];
  footIcons.forEach((name,i)=>{
    rect(ms,name+' btn',10+i*34,H-48,28,28,T.bgManusBar,8);
  });

  // ── Main content ───────────────────────────────────────────────────────
  const main=figma.createFrame();
  main.name='New Task Main'; main.x=248; main.y=0;
  main.resize(W-248,H); main.fills=solidFill({r:.980,g:.980,b:.973}); // #fafaf8
  f.appendChild(main);

  // Top right plan bar
  const pill=rect(main,'Plan pill',W-248-200,16,88,28,{r:.941,g:.941,b:.933},20);
  stroke(pill,T.gray300);
  await text(main,'免费计划',W-248-188,22,{size:12,color:T.gray600,weight:'Medium'});
  await text(main,'开始免费试用',W-248-100,22,{size:13,color:T.blue,weight:'Medium'});

  // Greeting
  const MW=W-248;
  await text(main,'我能为你做什么？', MW/2-170, H/2-140,
    {size:34,weight:'Medium',color:T.gray900});

  // Input card
  const ic=rect(main,'Input card', MW/2-340, H/2-80, 680, 120, T.white, 20);
  shadow(ic); stroke(ic,{r:.9,g:.9,b:.9});

  // Toolbar row in input
  const tools=['Add','Tool','Connectors'];
  tools.forEach((t,i)=>rect(main,t+' btn',MW/2-340+16+i*40,H/2-80+76,32,32,
    {r:.957,g:.957,b:.949},8));
  // Send btn
  rect(main,'Send btn',MW/2-340+680-52,H/2-80+76,32,32,T.gray900,16);

  // Placeholder text
  await text(main,'分配一个任务或提问任何问题', MW/2-324, H/2-80+18,
    {size:15,color:T.gray400});

  // Tool connect strip
  const strip=rect(main,'Tool strip',MW/2-340,H/2+56,680,36,{r:.957,g:.957,b:.949},10);
  await text(main,'将您的工具连接到 Manus',MW/2-320,H/2+64,{size:12,color:T.gray400});

  // App icon squares
  const appColors=[
    {r:.0,g:.533,b:.8},{r:.024,g:.400,b:1},
    {r:.145,g:.827,b:.4},{r:.878,g:.118,b:.353},
    {r:.067,g:.067,b:.067},{r:.039,g:.400,b:.761},
  ];
  appColors.forEach((c,i)=>rect(main,'App ico',MW/2-340+680-120+i*20,H/2+62,16,16,c,4));

  // Quick action chips
  const chips=[
    {label:'制作幻灯片',w:100},
    {label:'创建网站',  w:88},
    {label:'开发应用',  w:88},
    {label:'设计',      w:68},
    {label:'更多',      w:68},
  ];
  let cx=MW/2-220;
  chips.forEach(async (ch)=>{
    const chip=rect(main,ch.label+' chip',cx,H/2+108,ch.w,34,T.white,17);
    stroke(chip,T.gray200);
    await text(main,ch.label,cx+14,H/2+116,{size:13,color:T.gray700});
    cx+=ch.w+10;
  });

  return f;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════
(async ()=>{
  // Create a new page or use current
  let page;
  const existingPage = figma.root.children.find(p=>p.name==='AI Prototype Screens');
  if(existingPage){
    // Clear existing children
    existingPage.children.forEach(c=>c.remove());
    page = existingPage;
  } else {
    page = figma.createPage();
    page.name = 'AI Prototype Screens';
  }
  figma.currentPage = page;

  try {
    const [f1,f2,f3,f4] = await Promise.all([
      buildLogin(),
      buildChat(),
      buildAgent(),
      buildNewTask(),
    ]);

    // Add all frames to the page
    [f1,f2,f3,f4].forEach(f=>page.appendChild(f));

    // Fit view
    figma.viewport.scrollAndZoomIntoView([f1,f2,f3,f4]);

    figma.notify('✅ 4 screens exported to "AI Prototype Screens" page!');
  } catch(err){
    figma.notify('❌ Error: '+err.message, {error:true});
    console.error(err);
  }

  figma.closePlugin();
})();
