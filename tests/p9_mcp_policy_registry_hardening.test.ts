import test from "node:test";import assert from "node:assert/strict";
import {MCPPolicyGateway} from "../src/pattern_124_mcp_policy_gateway.js";
import {TrustedToolRegistry} from "../src/pattern_125_trusted_tool_registry.js";
test("124 rejects malformed args and fails closed",()=>{
 const gate=new MCPPolicyGateway((actor,tool,args)=>actor==="alice"&&tool==="read"&&args.id===1);
 assert.equal(gate.authorize("alice","read",{id:1}).allowed,true);
 assert.throws(()=>gate.authorize("alice","read",[] as unknown as Record<string,unknown>));
 assert.throws(()=>gate.authorize("alice","write",{id:1}));
 assert.throws(()=>gate.authorize("alice","read",{id:2}));
});
test("124 policy receives isolated snapshot",()=>{
 const args={nested:{value:1}};
 const gate=new MCPPolicyGateway((_a,_t,data)=>{(data.nested as {value:number}).value=99;return true;});
 gate.authorize("alice","read",args);assert.equal(args.nested.value,1);
});
test("125 requires HTTPS origin without credentials, path or query",()=>{
 const registry=new TrustedToolRegistry();
 registry.register("read","https://example.org",Date.now()+60000);
 assert.equal(registry.resolve("read","https://example.org/").origin,"https://example.org");
 for(const bad of ["http://example.org","https://u:p@example.org","https://example.org/path","https://example.org/?x=1","https://example.org/#frag"])assert.throws(()=>registry.register("bad",bad,Date.now()+60000));
 assert.throws(()=>registry.resolve("read","https://evil.org"));
});
