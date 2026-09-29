import {useEffect,useReducer,useState,useEffectEvent} from 'react';
import {LatestQuery} from './controllers';
export function useQuery<T>(load:()=>Promise<T>,dependencies:unknown[]){
 const [tick,retry]=useReducer(n=>n+1,0);const [,render]=useReducer(n=>n+1,0);
 const latestLoad=useEffectEvent(load);
 const [controller]=useState(()=>new LatestQuery<T>());
 useEffect(()=>{let active=true;void Promise.resolve().then(async()=>{if(!active)return;const pending=controller.run(()=>latestLoad());render();await pending;if(active)render();});return ()=>{active=false;controller.invalidate();};
 // The caller specifies stable primitives representing the query.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[controller,tick,...dependencies]);
 return {data:controller.data,loading:controller.loading||controller.data===undefined&&!controller.error,error:controller.error,retry};
}
