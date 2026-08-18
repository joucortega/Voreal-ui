import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{d as n,f as r,h as i,n as a,p as o,x as s}from"./icons-DNGv0qwg.js";import{i as c,n as l,r as u,t as d}from"./button-x5EN5q5c.js";import{a as f,i as p,n as m,o as h,r as g,t as _}from"./signature-actions-5wwDd2DK.js";var v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{s(),c(),h(),v=t(),y={title:`Actions/Button Language`,component:d,args:{children:`Explorar negocios`,size:`md`,variant:`primary`},argTypes:{density:{control:`inline-radio`,options:[void 0,`comfortable`,`compact`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`icon`]},variant:{control:`select`,options:[`primary`,`secondary`,`outline`,`ghost`,`danger`,`link`]}}},b={},x={render:()=>(0,v.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`1rem`},children:[(0,v.jsx)(d,{children:`Primario`}),(0,v.jsx)(d,{variant:`secondary`,children:`Secundario`}),(0,v.jsx)(d,{variant:`outline`,children:`Contorno`}),(0,v.jsx)(d,{variant:`ghost`,children:`Discreto`}),(0,v.jsx)(d,{variant:`danger`,children:`Eliminar`}),(0,v.jsx)(d,{variant:`link`,children:`Ver todos`})]})},S={render:()=>(0,v.jsxs)(`div`,{style:{display:`grid`,gap:`1rem`,justifyItems:`start`},children:[(0,v.jsx)(d,{loading:!0,children:`Guardando negocio`}),(0,v.jsx)(d,{disabled:!0,children:`Acción no disponible`}),(0,v.jsx)(d,{autoFocus:!0,variant:`outline`,children:`Foco visible al abrir`})]})},C={render:()=>(0,v.jsxs)(`div`,{style:{display:`grid`,gap:`0.75rem`,justifyItems:`start`},children:[(0,v.jsx)(`span`,{style:{color:`var(--vr-text-muted)`,fontSize:`var(--vr-text-sm)`},children:`Mueve el cursor para inspeccionar elevación, color y desplazamiento de 2px.`}),(0,v.jsx)(d,{endIcon:(0,v.jsx)(a,{}),children:`Pasa el cursor aquí`})]})},w={render:()=>(0,v.jsxs)(l,{label:`Herramientas de negocio`,children:[(0,v.jsx)(d,{variant:`secondary`,children:`Editar`}),(0,v.jsx)(d,{variant:`secondary`,children:`Duplicar`}),(0,v.jsx)(u,{label:`Más opciones`,variant:`secondary`,children:(0,v.jsx)(i,{})})]})},T={render:()=>(0,v.jsxs)(`div`,{style:{display:`grid`,gap:`2rem`,justifyItems:`start`},children:[(0,v.jsx)(g,{destination:`Directorio`,children:`Descubrir negocios`}),(0,v.jsx)(p,{status:`12 negocios abiertos`,children:`Explorar ahora`}),(0,v.jsx)(f,{primary:{label:`Ver perfil`},secondary:{label:`Cómo llegar`}}),(0,v.jsx)(_,{defaultValue:`list`,items:[{value:`list`,label:`Lista`,icon:(0,v.jsx)(r,{})},{value:`map`,label:`Mapa`,icon:(0,v.jsx)(o,{})},{value:`grid`,label:`Cuadrícula`,icon:(0,v.jsx)(n,{})}],label:`Vista de resultados`})]})},E={render:()=>(0,v.jsx)(m,{action:(0,v.jsx)(g,{destination:`Comunidad`,size:`lg`,children:`Encontrar negocios latinos confiables cerca de mi ubicación`}),description:`Explora restaurantes, servicios profesionales, comercios y experiencias creadas por nuestra comunidad local.`,eyebrow:`Hecho cerca de ti`,title:`El directorio que conecta a nuestra comunidad con negocios que sí entiende`})},D={render:()=>(0,v.jsxs)(`div`,{"data-vr-density":`compact`,style:{display:`flex`,gap:`0.5rem`},children:[(0,v.jsx)(d,{density:`compact`,size:`sm`,children:`Publicar`}),(0,v.jsx)(d,{density:`compact`,size:`sm`,variant:`outline`,children:`Guardar borrador`}),(0,v.jsx)(u,{density:`compact`,label:`Más acciones`,variant:`ghost`,children:(0,v.jsx)(i,{})})]})},O={parameters:{viewport:{defaultViewport:`mobile1`}},render:()=>(0,v.jsx)(`div`,{style:{inlineSize:`min(100%, 22rem)`},children:(0,v.jsx)(m,{action:(0,v.jsx)(g,{destination:`Resultados`,children:`Buscar ahora`}),description:`Filtros rápidos y resultados útiles sin perder contexto.`,title:`Tu ruta local`})})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem"
  }}>
      <Button>Primario</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="outline">Contorno</Button>
      <Button variant="ghost">Discreto</Button>
      <Button variant="danger">Eliminar</Button>
      <Button variant="link">Ver todos</Button>
    </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: "1rem",
    justifyItems: "start"
  }}>
      <Button loading>Guardando negocio</Button>
      <Button disabled>Acción no disponible</Button>
      <Button autoFocus variant="outline">
        Foco visible al abrir
      </Button>
    </div>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: "0.75rem",
    justifyItems: "start"
  }}>
      <span style={{
      color: "var(--vr-text-muted)",
      fontSize: "var(--vr-text-sm)"
    }}>
        Mueve el cursor para inspeccionar elevación, color y desplazamiento de 2px.
      </span>
      <Button endIcon={<ArrowRightIcon />}>Pasa el cursor aquí</Button>
    </div>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonGroup label="Herramientas de negocio">
      <Button variant="secondary">Editar</Button>
      <Button variant="secondary">Duplicar</Button>
      <IconButton label="Más opciones" variant="secondary">
        <MoreHorizontalIcon />
      </IconButton>
    </ButtonGroup>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: "2rem",
    justifyItems: "start"
  }}>
      <PathButton destination="Directorio">Descubrir negocios</PathButton>
      <RelayButton status="12 negocios abiertos">Explorar ahora</RelayButton>
      <SplitBridge primary={{
      label: "Ver perfil"
    }} secondary={{
      label: "Cómo llegar"
    }} />
      <ActionRail defaultValue="list" items={[{
      value: "list",
      label: "Lista",
      icon: <ListIcon />
    }, {
      value: "map",
      label: "Mapa",
      icon: <LocateFixedIcon />
    }, {
      value: "grid",
      label: "Cuadrícula",
      icon: <LayoutGridIcon />
    }]} label="Vista de resultados" />
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <LinkedCta action={<PathButton destination="Comunidad" size="lg">
          Encontrar negocios latinos confiables cerca de mi ubicación
        </PathButton>} description="Explora restaurantes, servicios profesionales, comercios y experiencias creadas por nuestra comunidad local." eyebrow="Hecho cerca de ti" title="El directorio que conecta a nuestra comunidad con negocios que sí entiende" />
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <div data-vr-density="compact" style={{
    display: "flex",
    gap: "0.5rem"
  }}>
      <Button density="compact" size="sm">
        Publicar
      </Button>
      <Button density="compact" size="sm" variant="outline">
        Guardar borrador
      </Button>
      <IconButton density="compact" label="Más acciones" variant="ghost">
        <MoreHorizontalIcon />
      </IconButton>
    </div>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <div style={{
    inlineSize: "min(100%, 22rem)"
  }}>
      <LinkedCta action={<PathButton destination="Resultados">Buscar ahora</PathButton>} description="Filtros rápidos y resultados útiles sin perder contexto." title="Tu ruta local" />
    </div>
}`,...O.parameters?.docs?.source}}},k=[`Playground`,`Variants`,`LoadingDisabledAndFocus`,`HoverSimulation`,`ConnectedButtons`,`SignatureActions`,`LongSpanishCopy`,`CompactAdminDensity`,`NarrowMobile`]})))()}A();export{D as CompactAdminDensity,w as ConnectedButtons,C as HoverSimulation,S as LoadingDisabledAndFocus,E as LongSpanishCopy,O as NarrowMobile,b as Playground,T as SignatureActions,x as Variants,k as __namedExportsOrder,y as default};