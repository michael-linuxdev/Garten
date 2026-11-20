// Seeded RNG
let seed=1;const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648};
const PL='SFTLMP';const isP=x=>PL.includes(x);
function okCell(g,R,C,r,c){const p=g[r][c];if(!isP(p))return true;
 const at=(a,b)=>a>=0&&b>=0&&a<R&&b<C?g[a][b]:null;const nb=[at(r-1,c),at(r+1,c),at(r,c-1),at(r,c+1)];const sh=nb.includes('S');
 if(p=='S'||p=='T')return !sh;if(p=='F')return sh;if(p=='L')return nb.filter(x=>x=='S'||x=='T').length>=2;
 if(p=='M')return !nb.some(isP);if(p=='P')return sh&&nb.includes('#');return true}
// count solutions given terrain map and multiset (with '.' as empty slot), cap
function count(map,inv,cap){const g=map.map(r=>r.split(''));const R=g.length,C=g[0].length;const cells=[];
 for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(g[r][c]=='.')cells.push([r,c]);
 const left={...inv};let n=0,sol=null;
 // fixed cells: check pos of terrain done implicitly. Order row-major.
 const idx={};cells.forEach(([r,c],i)=>idx[r*C+c]=i);
 function decided(r,c,k){// cell decided if terrain or index<=k
  if(r<0||c<0||r>=R||c>=C)return true;const i=idx[r*C+c];return i===undefined||i<=k}
 function check(k){// check cells whose all neighbors decided now
  const [r,c]=cells[k];const cand=[[r,c],[r-1,c],[r,c-1],[r+1,c],[r,c+1]];
  for(const [a,b] of cand){if(a<0||b<0||a>=R||b>=C)continue;const i=idx[a*C+b];if(i!==undefined&&i>k)continue;
   if(decided(a-1,b,k)&&decided(a+1,b,k)&&decided(a,b-1,k)&&decided(a,b+1,k)&&!okCell(g,R,C,a,b))return false}
  return true}
 function rec(k){if(n>=cap)return;if(k==cells.length){n++;if(!sol)sol=g.map(r=>r.join(''));return}
  const [r,c]=cells[k];for(const key in left)if(left[key]>0){left[key]--;g[r][c]=key;if(check(k))rec(k+1);g[r][c]='.';left[key]++}}
 rec(0);return {n,sol}}
// generate random solved board
function make(R,C,plants,stones,ponds,empties){
 for(let t=0;t<20000;t++){const g=[...Array(R)].map(()=>Array(C).fill('.'));
  const free=()=>{const f=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(g[r][c]=='.')f.push([r,c]);return f};
  for(let i=0;i<stones;i++){const f=free();const [r,c]=f[Math.floor(rnd()*f.length)];g[r][c]='#'}
  if(ponds){const r=Math.floor(rnd()*(R-1)),c=Math.floor(rnd()*(C-1));for(const [a,b] of [[r,c],[r,c+1],[r+1,c],[r+1,c+1]].slice(0,ponds))g[a][b]='~'}
  const f=free();if(f.length<empties+3)continue;
  for(let i=0;i<empties;i++){const j=Math.floor(rnd()*f.length);f.splice(j,1)[0]}
  // random fill plants then hill-climb
  for(const [r,c] of f)g[r][c]=plants[Math.floor(rnd()*plants.length)];
  // empty markers already '.'
  let good=false;for(let it=0;it<3000;it++){let bad=[];for(const [r,c] of f)if(!okCell(g,R,C,r,c))bad.push([r,c]);
   // also neighbors of bad
   if(!bad.length){good=true;break}const [r,c]=bad[Math.floor(rnd()*bad.length)];
   const nb=[[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>f.some(([x,y])=>x==a&&y==b));const [a,b]=nb[Math.floor(rnd()*nb.length)];
   g[a][b]=plants[Math.floor(rnd()*plants.length)]}
  if(!good)continue;
  const used=new Set(f.map(([r,c])=>g[r][c]));if(plants.some(p=>!used.has(p)))continue;
  const inv={};for(const [r,c] of f)inv[g[r][c]]=(inv[g[r][c]]||0)+1;
  const map=g.map(row=>row.map(x=>isP(x)?'.':x).join(''));
  const invE={...inv};const freeCount=map.join('').split('.').length-1;const emp=freeCount-f.length;if(emp)invE['.']=emp;
  return {map,inv,invE}}
 return null}
const SPEC=[
 [1,2,3,'SF',0,0,0,3],[1,3,3,'SF',0,0,0,4],[1,3,3,'SF',1,0,0,3],[1,3,4,'SF',0,0,0,3],[1,3,4,'SF',1,0,0,2],
 [2,3,3,'SFT',0,0,0,8],[2,3,4,'SFT',0,0,0,6],[2,3,4,'SFT',2,0,0,4],[2,4,4,'SFT',2,0,0,4],[2,4,4,'SFT',1,0,0,3],
 [3,3,4,'SFTL',0,0,0,10],[3,3,4,'SFTL',1,0,0,8],[3,4,4,'SFTL',2,0,0,6],[3,4,4,'SFTL',3,0,0,6],[3,4,4,'SFTL',1,0,0,5],
 [4,3,4,'SFTM',1,0,2,6],[4,4,4,'SFTM',2,0,2,6],[4,4,4,'SFTLM',2,0,2,6],[4,4,4,'SFTLM',1,0,2,6],[4,4,4,'SFTLM',3,0,3,5],
 [5,3,4,'SFTP',2,0,0,5],[5,4,4,'SFTP',3,0,0,4],[5,4,4,'SFTLP',3,0,0,5],[5,4,4,'SFTLP',2,0,0,5],[5,4,4,'SFTMP',3,0,2,5],
 [6,4,4,'SFTL',1,4,0,6],[6,4,4,'SFTLM',2,4,2,6],[6,4,5,'SFTLP',3,4,0,6],[6,4,5,'SFTLP',2,4,0,5],[6,4,5,'SFTLMP',3,4,2,6],
];
const out=[];seed=42;
for(const [ch,R,C,pl,st,po,em,maxS] of SPEC){let best=null;
 for(let t=0;t<(ch>=3?14:8)&&!(best&&best.n<=maxS&&best.fixed==0);t++){const m=make(R,C,pl.split(''),st,po,em);if(!m)continue;
  let r=count(m.map,m.invE,maxS+1);let fixed=0;
  // fix plants from the solution until few solutions remain
  while(r.n>maxS){const sol=r.sol;const opts=[];sol.forEach((row,a)=>row.split('').forEach((x,b)=>{if(isP(x)&&m.map[a][b]=='.')opts.push([a,b,x])}));
   if(!opts.length)break;const [a,b,x]=opts[Math.floor(rnd()*opts.length)];
   m.map[a]=m.map[a].slice(0,b)+x+m.map[a].slice(b+1);m.inv[x]--;if(!m.inv[x])delete m.inv[x];m.invE[x]--;if(!m.invE[x])delete m.invE[x];fixed++;
   r=count(m.map,m.invE,maxS+1)}
  if(r.n<1||r.n>maxS)continue;
  if(!best||fixed<best.fixed||(fixed==best.fixed&&r.n<best.n))best={...m,n:r.n,sol:r.sol,fixed}}
 if(!best){console.error('FAIL',ch,R,C,pl);process.exit(1)}
 out.push({ch,map:best.map,inv:best.inv,sol:best.sol,n:best.n});require('fs').writeFileSync(__dirname+'/levels.json',JSON.stringify(out));console.error(ch,R+'x'+C,pl,'sol',best.n,'fix',best.fixed)}
require('fs').writeFileSync(__dirname+'/levels.json',JSON.stringify(out));
