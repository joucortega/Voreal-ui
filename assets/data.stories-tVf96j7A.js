import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{c as r,s as i}from"./iframe-45GFWMZS.js";import{a,i as o,n as s,r as c,t as l}from"./card-DUj7kznx.js";import{n as u,t as d}from"./media-Bq9c7msz.js";import{i as f,n as p,r as m,t as h}from"./stat-card-CSHi-Egj.js";function g({className:e,items:t,...n}){return(0,_.jsx)(`dl`,{...n,className:i(`vr-definition-list`,e),children:t.map((e,t)=>(0,_.jsxs)(`div`,{className:`vr-definition-list__item`,children:[(0,_.jsx)(`dt`,{className:`vr-definition-list__term`,children:e.term}),(0,_.jsx)(`dd`,{className:`vr-definition-list__description`,children:e.description})]},t))})}var _;function v(){return(v=e((()=>{r(),_=n(),g.__docgenInfo={description:``,methods:[],displayName:`DefinitionList`,props:{items:{required:!0,tsType:{name:`unknown`},description:``}}}})))()}function y({loading:e=!1}){let[t,n]=(0,b.useState)(new Set([`1`])),[r,i]=(0,b.useState)({direction:`asc`,key:`name`});return(0,x.jsx)(m,{columns:C,getRowKey:e=>e.id,getRowLabel:e=>e.name,label:`Negocios administrados`,loading:e,onSelectionChange:n,onSortChange:i,rows:S,selectedKeys:t,sort:r})}var b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{b=t(),a(),c(),u(),f(),v(),p(),x=n(),S=[{category:`Restaurante`,id:`1`,name:`Sabor de Casa`,status:`Publicado`},{category:`Servicios profesionales`,id:`2`,name:`Martínez Tax Services`,status:`Publicado`},{category:`Belleza y bienestar`,id:`3`,name:`Luna Beauty Studio`,status:`Pendiente`}],C=[{cell:e=>(0,x.jsx)(`strong`,{children:e.name}),header:`Negocio`,key:`name`,sortable:!0},{cell:e=>e.category,header:`Categoría`,key:`category`,sortable:!0},{cell:e=>(0,x.jsx)(o,{variant:e.status===`Publicado`?`success`:`warning`,children:e.status}),header:`Estado`,key:`status`}],w={title:`Content/Content and Data`,component:y},T={},E={args:{loading:!0}},D={render:()=>(0,x.jsx)(m,{columns:C,emptyDescription:`Prueba otra categoría o amplía la distancia.`,emptyTitle:`No encontramos negocios cerca`,getRowKey:e=>e.id,label:`Resultados filtrados`,rows:[]})},O={render:()=>(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(15rem, 1fr))`,gap:`1rem`},children:[(0,x.jsxs)(s,{href:`/negocios/sabor-de-casa`,padding:`none`,children:[(0,x.jsx)(d,{alt:`Sabor de Casa`,fallback:`SC`,src:`/missing-sabor.jpg`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:`0.5rem`,padding:`1.25rem`},children:[(0,x.jsx)(o,{variant:`success`,children:`Abierto ahora`}),(0,x.jsx)(`strong`,{children:`Sabor de Casa`}),(0,x.jsx)(`span`,{children:`Restaurante mexicano · Baltimore`})]})]}),(0,x.jsxs)(l,{padding:`none`,children:[(0,x.jsx)(d,{alt:`Martínez Tax Services`,fallback:`MT`}),(0,x.jsxs)(`div`,{style:{display:`grid`,gap:`0.5rem`,padding:`1.25rem`},children:[(0,x.jsx)(o,{variant:`accent`,children:`Verificado`}),(0,x.jsx)(`strong`,{children:`Martínez Tax Services`}),(0,x.jsx)(`span`,{children:`Impuestos y contabilidad · Dundalk`})]})]})]})},k={render:()=>(0,x.jsxs)(`div`,{"data-vr-density":`compact`,style:{display:`grid`,gap:`1rem`},children:[(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(13rem, 1fr))`,gap:`1rem`},children:[(0,x.jsx)(h,{change:`+12%`,label:`Perfiles activos`,supportingText:`Frente al mes anterior`,value:`1,248`}),(0,x.jsx)(h,{change:`+8%`,label:`Búsquedas semanales`,supportingText:`Últimos 7 días`,value:`18,420`}),(0,x.jsx)(h,{label:`Pendientes de revisión`,supportingText:`Requieren atención`,value:`37`})]}),(0,x.jsx)(g,{items:[{description:`Jou Ortega`,term:`Administrador`},{description:`13 de agosto de 2026`,term:`Última actualización`},{description:`Red Latina 360`,term:`Tema activo`}]})]})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={columns} emptyDescription="Prueba otra categoría o amplía la distancia." emptyTitle="No encontramos negocios cerca" getRowKey={row => row.id} label="Resultados filtrados" rows={[]} />
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
    gap: "1rem"
  }}>
      <CardLink href="/negocios/sabor-de-casa" padding="none">
        <Media alt="Sabor de Casa" fallback="SC" src="/missing-sabor.jpg" />
        <div style={{
        display: "grid",
        gap: "0.5rem",
        padding: "1.25rem"
      }}>
          <Badge variant="success">Abierto ahora</Badge>
          <strong>Sabor de Casa</strong>
          <span>Restaurante mexicano · Baltimore</span>
        </div>
      </CardLink>
      <Card padding="none">
        <Media alt="Martínez Tax Services" fallback="MT" />
        <div style={{
        display: "grid",
        gap: "0.5rem",
        padding: "1.25rem"
      }}>
          <Badge variant="accent">Verificado</Badge>
          <strong>Martínez Tax Services</strong>
          <span>Impuestos y contabilidad · Dundalk</span>
        </div>
      </Card>
    </div>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div data-vr-density="compact" style={{
    display: "grid",
    gap: "1rem"
  }}>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
      gap: "1rem"
    }}>
        <StatCard change="+12%" label="Perfiles activos" supportingText="Frente al mes anterior" value="1,248" />
        <StatCard change="+8%" label="Búsquedas semanales" supportingText="Últimos 7 días" value="18,420" />
        <StatCard label="Pendientes de revisión" supportingText="Requieren atención" value="37" />
      </div>
      <DefinitionList items={[{
      description: "Jou Ortega",
      term: "Administrador"
    }, {
      description: "13 de agosto de 2026",
      term: "Última actualización"
    }, {
      description: "Red Latina 360",
      term: "Tema activo"
    }]} />
    </div>
}`,...k.parameters?.docs?.source}}},A=[`BusinessTable`,`LoadingTable`,`EmptyTable`,`DirectoryCards`,`AdminMetrics`]})))()}j();export{k as AdminMetrics,T as BusinessTable,O as DirectoryCards,D as EmptyTable,E as LoadingTable,A as __namedExportsOrder,w as default};