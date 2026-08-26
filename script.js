const demoNews=[
 {tag:"FOOTBALL",title:"Welcome to MOL L5IBRA",text:"Your new home for football stories, wisdom and legends."},
 {tag:"STORIES",title:"The game is more than 90 minutes",text:"Discover stories that made football unforgettable."},
 {tag:"NEWS",title:"Your content goes here",text:"Use the Admin Panel to publish your own articles."}
];
const demoLegends=[
 {tag:"LEGEND",title:"The Legends",text:"Build your own collection of unforgettable players."},
 {tag:"LEGACY",title:"Greatness lasts",text:"Add legendary players from the Admin Panel."}
];
const demoStore=[
 {tag:"STORE",title:"MOL L5IBRA T-Shirt",text:"Store demo product",price:"—"},
 {tag:"STORE",title:"Football Collection",text:"Add your products from the Admin Panel.",price:"—"}
];
function cards(items,type){return items.map(x=>`<article class="card"><span class="tag">${x.tag||type}</span><h3>${x.title}</h3><p>${x.text||""}</p>${x.price?`<div class="price">${x.price}</div>`:""}</article>`).join("")}
function render(){document.querySelector("#news-grid").innerHTML=cards(demoNews,"NEWS");document.querySelector("#legends-grid").innerHTML=cards(demoLegends,"LEGEND");document.querySelector("#store-grid").innerHTML=cards(demoStore,"STORE")}
render();

async function loadSupabase(){
 if(!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)return;
 try{
   const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
   const supabase=createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
   const {data}=await supabase.from("content").select("*").order("created_at",{ascending:false});
   if(data?.length){
     const news=data.filter(x=>x.type==="news"), legends=data.filter(x=>x.type==="legend"), store=data.filter(x=>x.type==="product");
     if(news.length)document.querySelector("#news-grid").innerHTML=cards(news,"NEWS");
     if(legends.length)document.querySelector("#legends-grid").innerHTML=cards(legends,"LEGEND");
     if(store.length)document.querySelector("#store-grid").innerHTML=cards(store,"STORE");
   }
 }catch(e){console.log("Supabase not configured yet.",e)}
}
loadSupabase();