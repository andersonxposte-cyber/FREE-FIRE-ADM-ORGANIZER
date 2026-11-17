import React, { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = { bg:'#080A13', panel:'#121629', panel2:'#191F36', purple:'#9B5CFF', blue:'#32B8FF', gold:'#F5C451', white:'#F5F6FA', muted:'#9AA3BC', green:'#42D69A', red:'#FF657A' };
const money = n => `${Number(n||0).toLocaleString('pt-PT')} MT`;
const uid = () => `${Date.now()}-${Math.floor(Math.random()*10000)}`;

export default function App() {
  const [tab,setTab] = useState('Início');
  const [nick,setNick] = useState('ADM Ánderson');
  const [bets,setBets] = useState([]);
  const [notes,setNotes] = useState([]);
  const [tournaments,setTournaments] = useState([]);
  const [moves,setMoves] = useState([]);
  const [payables,setPayables] = useState([]);
  const [receivables,setReceivables] = useState([]);
  const [loaded,setLoaded] = useState(false);
  const [amount,setAmount] = useState('10');
  const [players,setPlayers] = useState(['','','','']);
  const [noteTitle,setNoteTitle] = useState('');
  const [noteBody,setNoteBody] = useState('');
  const [teamCount,setTeamCount] = useState('4');
  const [teamNames,setTeamNames] = useState('');
  const [tournamentType,setTournamentType] = useState('Contra Squad');
  const [manual,setManual] = useState('');
  const [manualDesc,setManualDesc] = useState('');
  const [newDebtName,setNewDebtName] = useState('');
  const [newDebtValue,setNewDebtValue] = useState('');
  const [debtType,setDebtType] = useState('A receber');

  useEffect(()=>{ (async()=>{
    try {
      const raw=await AsyncStorage.getItem('ffadm-v1');
      if(raw){ const d=JSON.parse(raw); setNick(d.nick||'ADM Ánderson'); setBets(d.bets||[]); setNotes(d.notes||[]); setTournaments(d.tournaments||[]); setMoves(d.moves||[]); setPayables(d.payables||[]); setReceivables(d.receivables||[]); }
    } catch(e) { Alert.alert('Aviso','Não foi possível carregar os dados guardados.'); }
    setLoaded(true);
  })(); },[]);
  useEffect(()=>{ if(loaded) AsyncStorage.setItem('ffadm-v1',JSON.stringify({nick,bets,notes,tournaments,moves,payables,receivables})).catch(()=>{}); },[loaded,nick,bets,notes,tournaments,moves,payables,receivables]);

  const commissions = bets.filter(b=>b.status!=='Cancelada').reduce((s,b)=>s+b.fee,0);
  const deposits = moves.reduce((s,m)=>s+(m.kind==='Adicionar'?m.value:-m.value),0);
  const balance = commissions + deposits;
  const pendingIn = receivables.filter(x=>!x.done).reduce((s,x)=>s+x.value,0);
  const pendingOut = payables.filter(x=>!x.done).reduce((s,x)=>s+x.value,0);
  const addMove = (kind,value,description) => setMoves(v=>[{id:uid(),kind,value:Number(value),description,date:new Date().toISOString()},...v]);
  const feeFor = v => v>=30 ? 10 : (v>=10 && v<=25 ? 5 : 0);

  function registerBet(){
    const v=Number(amount);
    if(!Number.isFinite(v)||v<5||v>100000){Alert.alert('Valor inválido','Introduza um valor entre 5 e 100.000 MT.');return;}
    if(players.every(p=>!p.trim())){Alert.alert('Participantes','Introduza pelo menos um participante.');return;}
    const fee=feeFor(v);
    const b={id:uid(),value:v,fee,players:players.map(x=>x.trim()).filter(Boolean),status:'Concluída',date:new Date().toISOString()};
    setBets(x=>[b,...x]); Alert.alert('Aposta registada',`Comissão adicionada: ${money(fee)}.`);
    setPlayers(['','','','']);
  }
  function createTournament(){
    const n=Number(teamCount), names=teamNames.split('\n').map(x=>x.trim()).filter(Boolean);
    if(n<4||n>16){Alert.alert('Número inválido','Escolha entre 4 e 16 equipas.');return;}
    if(names.length!==n){Alert.alert('Equipas','Introduza exatamente '+n+' nomes, um por linha.');return;}
    const shuffled=[...names].sort(()=>Math.random()-.5), rounds=[];
    for(let i=0;i<shuffled.length;i+=2) rounds.push({a:shuffled[i],b:shuffled[i+1]||'BYE'});
    const t={id:uid(),type:tournamentType,count:n,names,rounds,date:new Date().toISOString(),prize:0,fee:0};
    setTournaments(x=>[t,...x]); setTeamNames(''); Alert.alert('Campeonato criado','Sorteio inicial guardado no histórico.');
  }
  const card=(children,style={})=><View style={[{backgroundColor:C.panel,borderColor:'#282F4B',borderWidth:1,borderRadius:18,padding:15,marginBottom:12},style]}>{children}</View>;
  const txt=(s,style={})=><Text style={[{color:C.white,fontSize:14},style]}>{s}</Text>;
  const label=s=>txt(s,{color:C.muted,fontSize:12,marginBottom:6});
  const input=(value,onChange,placeholder,keyboard='default')=><TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#707A96" keyboardType={keyboard} style={{backgroundColor:C.panel2,color:C.white,borderRadius:12,padding:12,marginBottom:10,borderWidth:1,borderColor:'#303957'}}/>;
  const btn=(title,onPress,color=C.purple)=> <TouchableOpacity onPress={onPress} style={{backgroundColor:color,padding:13,borderRadius:12,alignItems:'center',marginTop:6}}><Text style={{color:'#080A13',fontWeight:'900'}}>{title}</Text></TouchableOpacity>;
  const heading=s=><Text style={{color:C.white,fontSize:21,fontWeight:'900',marginBottom:14}}>{s}</Text>;
  const small=(s)=><Text style={{color:C.muted,fontSize:11,marginTop:4}}>{s}</Text>;

  function Home(){return <>{heading('Painel do ADM')}<Text style={{color:C.muted,marginBottom:14}}>Bem-vindo, {nick} 👋</Text>{card(<><Text style={{color:C.muted}}>SALDO DO ADMINISTRADOR</Text><Text style={{color:C.gold,fontSize:32,fontWeight:'900',marginTop:5}}>{money(balance)}</Text><Text style={{color:C.green,marginTop:5}}>Comissões acumuladas: {money(commissions)}</Text></>,{borderColor:C.purple})}<View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>{[['Apostas',bets.length],['Campeonatos',tournaments.length],['A receber',money(pendingIn)],['A pagar',money(pendingOut)]].map(([k,v])=>card(<>{txt(String(v),{fontSize:20,fontWeight:'900',color:C.blue})}{small(k)}</>,{width:'48%'}))}</View>{card(<>{txt('Atalhos rápidos',{fontWeight:'800',fontSize:16})}{btn('＋ Registar aposta',()=>setTab('Apostas'))}{btn('＋ Criar campeonato',()=>setTab('Campeonatos'),C.gold)}{btn('＋ Nova nota',()=>setTab('Inventário'),C.blue)}{btn('Ver conta e movimentos',()=>setTab('Conta'),C.green)}</>)}</>}
  function Bets(){return <>{heading('Gestão de apostas')}{card(<>{txt('Nova aposta',{fontWeight:'800',fontSize:17})}{label('Valor da aposta (MT)')}<View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:10}}>{['10','15','25','50','100'].map(v=><TouchableOpacity onPress={()=>setAmount(v)} style={{padding:10,borderRadius:10,backgroundColor:amount===v?C.purple:C.panel2}}><Text style={{color:C.white,fontWeight:'800'}}>{v} MT</Text></TouchableOpacity>)}</View>{input(amount,setAmount,'Outro valor','numeric')}{label('Participantes — X1 a X4')}{players.map((p,i)=>input(p,v=>setPlayers(old=>old.map((x,j)=>j===i?v:x)),`X${i+1} — nick do jogador`))}<Text style={{color:C.gold,fontWeight:'800'}}>Comissão prevista: {money(feeFor(Number(amount)))}</Text>{btn('REGISTAR APOSTA',registerBet)}</>)}{heading('Histórico de apostas')}{bets.map(b=>card(<><View style={{flexDirection:'row',justifyContent:'space-between'}}>{txt(money(b.value),{fontWeight:'900',fontSize:17})}{txt(b.status,{color:b.status==='Cancelada'?C.red:C.green})}</View>{small(b.players.join(' • '))}{small(new Date(b.date).toLocaleString('pt-PT'))}{txt('Comissão: '+money(b.fee),{color:C.gold,marginTop:7})}{btn('Cancelar registo',()=>Alert.alert('Cancelar aposta?','A operação será marcada como cancelada.',[{text:'Voltar'},{text:'Cancelar aposta',style:'destructive',onPress:()=>setBets(old=>old.map(x=>x.id===b.id?{...x,status:'Cancelada'}:x))}]),C.red)}</>))}</>}
  function Tournaments(){return <>{heading('Campeonatos')}{card(<>{txt('Criar campeonato',{fontWeight:'800',fontSize:17})}<View style={{flexDirection:'row',gap:8,marginVertical:10}}>{['Contra Squad','Mapa aberto'].map(x=><TouchableOpacity onPress={()=>setTournamentType(x)} style={{flex:1,padding:10,borderRadius:10,backgroundColor:tournamentType===x?C.purple:C.panel2}}><Text style={{color:C.white,textAlign:'center',fontWeight:'700'}}>{x}</Text></TouchableOpacity>)}</View>{label('Número de equipas (4 a 16)')}{input(teamCount,setTeamCount,'4','numeric')}{label('Nomes das equipas — um por linha')}{input(teamNames,setTeamNames,'Equipa A\\nEquipa B\\nEquipa C\\nEquipa D')}{btn('SORTEAR E GUARDAR',createTournament,C.gold)}</>)}{heading('Histórico de campeonatos')}{tournaments.map(t=>card(<>{txt(t.type+' • '+t.count+' equipas',{fontWeight:'900'})}{small(new Date(t.date).toLocaleString('pt-PT'))}{t.rounds.map((r,i)=>txt(`${i+1}. ${r.a}  VS  ${r.b}`,{marginTop:8,color:C.blue,fontWeight:'700'}))}{btn('Copiar confrontos',()=>Alert.alert('Confrontos',t.rounds.map(r=>r.a+' VS '+r.b).join('\\n')),C.blue)}</>))}</>}
  function Inventory(){return <>{heading('Inventário / Notas')}{card(<>{txt('Adicionar nota',{fontWeight:'800',fontSize:17})}{input(noteTitle,setNoteTitle,'Título da nota')}{input(noteBody,setNoteBody,'Escreva regras, avisos ou informações...')}{btn('GUARDAR NOTA',()=>{if(!noteTitle.trim()||!noteBody.trim()){Alert.alert('Nota incompleta','Preencha título e conteúdo.');return;}setNotes(x=>[{id:uid(),title:noteTitle,body:noteBody,date:new Date().toISOString()},...x]);setNoteTitle('');setNoteBody('');},C.blue)}</>)}{notes.map(n=>card(<>{txt(n.title,{fontWeight:'900',fontSize:16})}{small(n.body)}{btn('Apagar nota',()=>setNotes(x=>x.filter(y=>y.id!==n.id)),C.red)}</>))}</>}
  function Account(){return <>{heading('Conta e finanças')}{card(<>{label('Saldo atual')}{txt(money(balance),{fontSize:28,fontWeight:'900',color:C.gold})}{small('Comissões: '+money(commissions))}{small('A receber: '+money(pendingIn)+'  •  A pagar: '+money(pendingOut))}</>)}{card(<>{txt('Movimento manual',{fontWeight:'800',fontSize:17})}{input(manual,setManual,'Valor em MT','numeric')}{input(manualDesc,setManualDesc,'Descrição do movimento')}{btn('ADICIONAR AO SALDO',()=>{const v=Number(manual);if(!v||v<0){Alert.alert('Valor inválido');return;}addMove('Adicionar',v,manualDesc||'Adição manual');setManual('');setManualDesc('');},C.green)}{btn('RETIRAR DO SALDO',()=>{const v=Number(manual);if(!v||v<0||v>balance){Alert.alert('Valor inválido','Verifique o valor e o saldo disponível.');return;}addMove('Retirar',v,manualDesc||'Retirada manual');setManual('');setManualDesc('');},C.red)}</>)}{card(<>{txt('A pagar / A receber',{fontWeight:'800',fontSize:17})}<View style={{flexDirection:'row',gap:8,marginVertical:10}}>{['A receber','A pagar'].map(x=><TouchableOpacity onPress={()=>setDebtType(x)} style={{flex:1,padding:10,borderRadius:10,backgroundColor:debtType===x?C.purple:C.panel2}}><Text style={{color:C.white,textAlign:'center'}}>{x}</Text></TouchableOpacity>)}</View>{input(newDebtName,setNewDebtName,'Nome / descrição')}{input(newDebtValue,setNewDebtValue,'Valor em MT','numeric')}{btn('REGISTAR',()=>{const v=Number(newDebtValue);if(!newDebtName.trim()||!v||v<0){Alert.alert('Dados incompletos');return;}const item={id:uid(),name:newDebtName,value:v,done:false};debtType==='A pagar'?setPayables(x=>[item,...x]):setReceivables(x=>[item,...x]);setNewDebtName('');setNewDebtValue('');},C.blue)}</>)}{[['A receber',receivables,setReceivables],['A pagar',payables,setPayables]].map(([title,list,setter])=><>{txt(title,{fontWeight:'900',marginBottom:8})}{list.map(x=>card(<><Text style={{color:C.white,fontWeight:'800'}}>{x.name} — {money(x.value)}</Text><Text style={{color:x.done?C.green:C.gold,marginTop:4}}>{x.done?'Concluído':'Pendente'}</Text>{!x.done&&btn('Marcar como concluído',()=>setter(old=>old.map(y=>y.id===x.id?{...y,done:true}:y)),C.green)}</>))}</>)}{heading('Histórico de movimentos')}{moves.map(m=>card(<>{txt(`${m.kind}: ${money(m.value)}`,{fontWeight:'800',color:m.kind==='Adicionar'?C.green:C.red})}{small(m.description)}{small(new Date(m.date).toLocaleString('pt-PT'))}</>))}</>}
  const screens={'Início':Home,'Apostas':Bets,'Campeonatos':Tournaments,'Inventário':Inventory,'Conta':Account};
  const Screen=screens[tab];
  return <SafeAreaView style={{flex:1,backgroundColor:C.bg}}><StatusBar barStyle="light-content" backgroundColor={C.bg}/><View style={{paddingHorizontal:18,paddingTop:12,paddingBottom:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><View><Text style={{color:C.purple,fontSize:11,fontWeight:'900',letterSpacing:2}}>FREE FIRE</Text><Text style={{color:C.white,fontSize:18,fontWeight:'900'}}>ADM ORGANIZER</Text></View><TouchableOpacity onPress={()=>Alert.prompt?Alert.prompt('Nick do ADM','Novo nome',setNick):Alert.alert('Nick do ADM','Para alterar, edite o nome no código inicial da aplicação.')}><Text style={{color:C.gold,fontWeight:'800'}}>⚙</Text></TouchableOpacity></View><ScrollView contentContainerStyle={{padding:16,paddingBottom:30}}><Screen/><Text style={{textAlign:'center',color:'#737D98',fontSize:11,marginTop:15}}>Ánderson (jj)</Text></ScrollView><View style={{flexDirection:'row',backgroundColor:'#101426',borderTopWidth:1,borderTopColor:'#252D48',paddingVertical:8,paddingHorizontal:4}}>{['Início','Apostas','Campeonatos','Inventário','Conta'].map((x,i)=><TouchableOpacity onPress={()=>setTab(x)} style={{flex:1,alignItems:'center',paddingVertical:7}}><Text style={{fontSize:18}}>{['⌂','◈','♜','▤','◉'][i]}</Text><Text style={{fontSize:9,fontWeight:'800',color:tab===x?C.gold:C.muted}}>{x}</Text></TouchableOpacity>)}</View></SafeAreaView>;
}
