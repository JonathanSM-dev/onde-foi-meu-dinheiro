export class DemoSession {
 active=false;name='Alex';
 enter(name:string){this.name=name.trim()||'Alex';this.active=true;}
 leave(){this.active=false;}
}
export class LatestQuery<T>{
 data:T|undefined;error:string|null=null;loading=false;private generation=0;
 invalidate(){this.generation++;}
 async run(load:()=>Promise<T>){
  const generation=++this.generation;this.loading=true;this.error=null;
  try{const data=await load();if(generation===this.generation)this.data=data;}
  catch(error){if(generation===this.generation)this.error=error instanceof Error?error.message:'Não foi possível carregar.';}
  finally{if(generation===this.generation)this.loading=false;}
 }
}
