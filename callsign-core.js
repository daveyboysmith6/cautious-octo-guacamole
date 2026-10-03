function formatCallsign(dept,division,values,name,prefix=''){
 let code=division.template;
 for(const [key,options] of Object.entries(division.variables||{})){
  let value=String(values[key]??options[0]??'');
  if(division.id==='nypd_highway'&&key==='callsign')value=value.split(' - ')[0];
  code=code.split('{'+key+'}').join(value);
 }
 const member=(prefix?prefix+' ':'')+(name.trim()||'Your name');
 return code+' | '+member+' | '+dept.agencyTag;
}
if(typeof module!=='undefined')module.exports={formatCallsign};
