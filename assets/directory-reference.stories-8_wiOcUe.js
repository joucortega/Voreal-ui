import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{c as r,s as i}from"./iframe-TbjMle7W.js";import{_ as a,a as o,l as s,m as c,n as l,p as ee,v as u,x as d,y as te}from"./icons-bt0FGfTk.js";import{i as f,t as p}from"./button-B5uRF2Hj.js";import{i as m,r as h,t as ne}from"./dist-Ch84w74-.js";import{n as re,o as ie,t as ae}from"./signature-actions-DpXZlIl2.js";import{a as g,i as _,r as v,t as y}from"./card-NGOuMRFu.js";import{n as b,t as x}from"./media-BvlFoDAq.js";import{i as oe,n as se,r as ce,t as le}from"./skeleton-De7-_Ozh.js";import{n as ue,t as de}from"./checkbox-B5gznuXX.js";import{n as fe,t as pe}from"./input-CGhYVO9p.js";import{a as me,i as he,n as ge,o as _e,r as ve,s as ye,t as be}from"./drawer-DTA-2sLc.js";function xe({advertiser:e,description:t,href:n,title:r}){return(0,S.jsxs)(y,{"aria-label":`Anuncio de ${e}`,className:`vr-ad-slot`,elevation:`none`,role:`complementary`,children:[(0,S.jsxs)(`div`,{className:`vr-ad-slot__copy`,children:[(0,S.jsx)(_,{children:`Patrocinado`}),(0,S.jsx)(`span`,{className:`vr-ad-slot__advertiser`,children:e}),(0,S.jsx)(`strong`,{children:r}),t?(0,S.jsx)(`p`,{children:t}):null]}),(0,S.jsxs)(`a`,{"aria-label":`Ver anuncio de ${e}`,className:`vr-ad-slot__link`,href:n,children:[`Conocer más `,(0,S.jsx)(l,{})]})]})}var S;function Se(){return(Se=e((()=>{g(),v(),d(),S=n(),xe.__docgenInfo={description:``,methods:[],displayName:`AdSlot`,props:{advertiser:{required:!0,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`string`},description:``},href:{required:!0,tsType:{name:`string`},description:``},title:{required:!0,tsType:{name:`string`},description:``}}}})))()}function C({LinkComponent:e,action:t,business:n,className:r,media:a,variant:o=`vertical`}){let s=e??`a`,c=`vr-business-${n.id}-title`;return(0,w.jsxs)(y,{"aria-labelledby":c,className:i(`vr-business-card`,r),"data-variant":o,elevation:o===`featured`?`high`:`low`,padding:`none`,role:`article`,children:[(0,w.jsxs)(`div`,{className:`vr-business-card__media`,children:[a??(0,w.jsx)(x,{alt:n.image?.alt??`Imagen de ${n.name}`,aspectRatio:o===`compact`?`1 / 1`:o===`horizontal`?`4 / 3`:`16 / 10`,fallback:n.image?.fallback??n.name.slice(0,2).toLocaleUpperCase(`es`),src:n.image?.src}),n.status?(0,w.jsx)(_,{className:`vr-business-card__status`,variant:n.status.tone??`neutral`,children:n.status.label}):null]}),(0,w.jsxs)(`div`,{className:`vr-business-card__body`,children:[(0,w.jsxs)(`div`,{className:`vr-business-card__heading`,children:[(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`h3`,{className:`vr-business-card__title`,id:c,children:n.name}),(0,w.jsx)(`p`,{className:`vr-business-card__category`,children:n.category})]}),n.verified?(0,w.jsx)(_,{variant:`accent`,children:`Verificado`}):null]}),(0,w.jsx)(`p`,{className:`vr-business-card__location`,children:n.location}),n.description?(0,w.jsx)(`p`,{className:`vr-business-card__description`,children:n.description}):null,n.rating===void 0?null:(0,w.jsxs)(`p`,{"aria-label":`${n.rating} de 5 estrellas, ${n.reviewCount??0} reseñas`,className:`vr-business-card__rating`,children:[(0,w.jsx)(u,{}),` `,n.rating.toFixed(1),` `,(0,w.jsxs)(`span`,{children:[`(`,n.reviewCount??0,`)`]})]}),(0,w.jsxs)(`div`,{className:`vr-business-card__actions`,children:[(0,w.jsxs)(s,{"aria-label":`Ver ${n.name}`,className:`vr-business-card__link`,href:n.href,children:[`Ver perfil `,(0,w.jsx)(l,{})]}),t]})]})]})}var w;function T(){return(T=e((()=>{g(),v(),b(),d(),r(),w=n(),C.__docgenInfo={description:``,methods:[],displayName:`BusinessCard`,props:{LinkComponent:{required:!1,tsType:{name:`ElementType`,elements:[{name:`intersection`,raw:`Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
}`,elements:[{name:`Omit`,elements:[{name:`AnchorHTMLAttributes`,elements:[{name:`HTMLAnchorElement`}],raw:`AnchorHTMLAttributes<HTMLAnchorElement>`},{name:`literal`,value:`"href"`}],raw:`Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">`},{name:`signature`,type:`object`,raw:`{
  href: string;
}`,signature:{properties:[{key:`href`,value:{name:`string`,required:!0}}]}}]}],raw:`ElementType<VorealLinkProps>`},description:``},action:{required:!1,tsType:{name:`ReactNode`},description:``},business:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  category: string;
  description?: string;
  href: string;
  id: string;
  image?: DirectoryImage;
  location: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  status?: BusinessStatus;
  tags?: readonly string[];
  verified?: boolean;
}`,signature:{properties:[{key:`category`,value:{name:`string`,required:!0}},{key:`description`,value:{name:`string`,required:!1}},{key:`href`,value:{name:`string`,required:!0}},{key:`id`,value:{name:`string`,required:!0}},{key:`image`,value:{name:`signature`,type:`object`,raw:`{
  alt: string;
  fallback?: string;
  src?: string;
}`,signature:{properties:[{key:`alt`,value:{name:`string`,required:!0}},{key:`fallback`,value:{name:`string`,required:!1}},{key:`src`,value:{name:`string`,required:!1}}]},required:!1}},{key:`location`,value:{name:`string`,required:!0}},{key:`name`,value:{name:`string`,required:!0}},{key:`rating`,value:{name:`number`,required:!1}},{key:`reviewCount`,value:{name:`number`,required:!1}},{key:`status`,value:{name:`signature`,type:`object`,raw:`{
  label: string;
  tone?: "danger" | "neutral" | "success" | "warning";
}`,signature:{properties:[{key:`label`,value:{name:`string`,required:!0}},{key:`tone`,value:{name:`union`,raw:`"danger" | "neutral" | "success" | "warning"`,elements:[{name:`literal`,value:`"danger"`},{name:`literal`,value:`"neutral"`},{name:`literal`,value:`"success"`},{name:`literal`,value:`"warning"`}],required:!1}}]},required:!1}},{key:`tags`,value:{name:`unknown`,required:!1}},{key:`verified`,value:{name:`boolean`,required:!1}}]}},description:``},className:{required:!1,tsType:{name:`string`},description:``},media:{required:!1,tsType:{name:`ReactNode`},description:``},variant:{required:!1,tsType:{name:`union`,raw:`"compact" | "featured" | "horizontal" | "vertical"`,elements:[{name:`literal`,value:`"compact"`},{name:`literal`,value:`"featured"`},{name:`literal`,value:`"horizontal"`},{name:`literal`,value:`"vertical"`}]},description:``,defaultValue:{value:`"vertical"`,computed:!1}}}}})))()}function E({address:e,className:t,directionsHref:n,email:r,phone:a,website:o,...s}){return(0,D.jsxs)(`section`,{...s,className:i(`vr-business-contact`,t),children:[(0,D.jsx)(`h2`,{children:`Contacto`}),(0,D.jsxs)(`dl`,{className:`vr-business-contact__list`,children:[a?(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`dt`,{children:`Teléfono`}),(0,D.jsx)(`dd`,{children:(0,D.jsx)(`a`,{href:`tel:${a}`,children:a})})]}):null,r?(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`dt`,{children:`Correo`}),(0,D.jsx)(`dd`,{children:(0,D.jsx)(`a`,{href:`mailto:${r}`,children:r})})]}):null,o?(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`dt`,{children:`Sitio web`}),(0,D.jsx)(`dd`,{children:(0,D.jsx)(`a`,{href:o,children:o})})]}):null,e?(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`dt`,{children:`Dirección`}),(0,D.jsx)(`dd`,{children:e})]}):null]}),n?(0,D.jsx)(`a`,{className:`vr-directory-action`,href:n,children:`Cómo llegar`}):null]})}var D;function O(){return(O=e((()=>{r(),D=n(),E.__docgenInfo={description:``,methods:[],displayName:`BusinessContact`,props:{address:{required:!1,tsType:{name:`string`},description:``},directionsHref:{required:!1,tsType:{name:`string`},description:``},email:{required:!1,tsType:{name:`string`},description:``},phone:{required:!1,tsType:{name:`string`},description:``},website:{required:!1,tsType:{name:`string`},description:``}}}})))()}function k({className:e,images:t,label:n=`Galería del negocio`,...r}){let a=t.length>0?t.slice(0,5):[{alt:`Imagen no disponible`,fallback:`RL`}];return(0,j.jsxs)(`div`,{...r,"aria-label":n,className:i(`vr-business-gallery`,e),role:`region`,children:[a.map((e,t)=>(0,A.createElement)(x,{...e,aspectRatio:t===0?`16 / 10`:`4 / 3`,className:`vr-business-gallery__item`,key:`${e.src??e.alt}-${t}`})),t.length>5?(0,j.jsxs)(`span`,{className:`vr-business-gallery__more`,children:[`+`,t.length-5,` fotos`]}):null]})}var A,j;function M(){return(M=e((()=>{b(),r(),A=t(),j=n(),k.__docgenInfo={description:``,methods:[],displayName:`BusinessGallery`,props:{images:{required:!0,tsType:{name:`unknown`},description:``},label:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"Galería del negocio"`,computed:!1}}}}})))()}function Ce({className:e,days:t,title:n=`Horario`,...r}){return(0,N.jsxs)(`section`,{...r,className:i(`vr-business-hours`,e),children:[(0,N.jsx)(`h2`,{children:n}),(0,N.jsx)(`dl`,{className:`vr-business-hours__list`,children:t.map(e=>(0,N.jsxs)(`div`,{className:`vr-business-hours__day`,children:[(0,N.jsx)(`dt`,{children:e.day}),(0,N.jsx)(`dd`,{"data-closed":e.closed?`true`:void 0,children:e.closed?`Cerrado`:e.hours??`Horario no disponible`})]},e.day))})]})}var N;function we(){return(we=e((()=>{r(),N=n(),Ce.__docgenInfo={description:``,methods:[],displayName:`BusinessHours`,props:{days:{required:!0,tsType:{name:`unknown`},description:``},title:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"Horario"`,computed:!1}}}}})))()}function P({categories:e,className:t,label:n=`Categorías`,onValueChange:r,value:a}){return(0,F.jsx)(ne,{"aria-label":n,className:i(`vr-category-scroller`,t),onValueChange:r,orientation:`horizontal`,value:a,children:e.map(e=>(0,F.jsxs)(h,{className:`vr-category-scroller__item`,value:e.value,children:[e.icon?(0,F.jsx)(`span`,{"aria-hidden":`true`,className:`vr-category-scroller__icon`,children:e.icon}):null,(0,F.jsx)(`span`,{children:e.label})]},e.value))})}var F;function Te(){return(Te=e((()=>{m(),r(),F=n(),P.__docgenInfo={description:``,methods:[],displayName:`CategoryScroller`,props:{categories:{required:!0,tsType:{name:`unknown`},description:``},className:{required:!1,tsType:{name:`string`},description:``},label:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"Categorías"`,computed:!1}},onValueChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string) => void`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`void`}}},description:``},value:{required:!0,tsType:{name:`string`},description:``}}}})))()}function I({businessName:e,href:t}){return(0,L.jsx)(re,{action:(0,L.jsx)(`a`,{className:`vr-directory-action`,href:t,children:`Reclamar perfil`}),description:`Confirma que representas a ${e}, actualiza sus datos y conecta con más clientes.`,eyebrow:`Para propietarios`,title:`¿Este es tu negocio?`})}var L;function Ee(){return(Ee=e((()=>{ie(),L=n(),I.__docgenInfo={description:``,methods:[],displayName:`ClaimBusinessCta`,props:{businessName:{required:!0,tsType:{name:`string`},description:``},href:{required:!0,tsType:{name:`string`},description:``}}}})))()}function De({className:e,locationLabel:t=`¿Dónde?`,onChange:n,onSubmit:r,queryLabel:a=`¿Qué buscas?`,submitLabel:o=`Buscar`,value:s}){function c(e){e.preventDefault(),r?.(s)}return(0,R.jsxs)(`form`,{"aria-label":`Buscar en el directorio`,className:i(`vr-directory-search`,e),onSubmit:c,role:`search`,children:[(0,R.jsxs)(`label`,{className:`vr-directory-search__field`,children:[(0,R.jsx)(`span`,{className:`vr-directory-search__label`,children:a}),(0,R.jsx)(pe,{"aria-label":a,className:`vr-directory-search__input`,onChange:e=>n({...s,query:e.target.value}),placeholder:`Tacos, abogado, salón…`,type:`search`,value:s.query})]}),(0,R.jsx)(`span`,{"aria-hidden":`true`,className:`vr-directory-search__divider`}),(0,R.jsxs)(`label`,{className:`vr-directory-search__field`,children:[(0,R.jsx)(`span`,{className:`vr-directory-search__label`,children:t}),(0,R.jsx)(pe,{"aria-label":t,className:`vr-directory-search__input`,onChange:e=>n({...s,location:e.target.value}),placeholder:`Ciudad o código postal`,value:s.location})]}),(0,R.jsx)(p,{className:`vr-directory-search__submit`,type:`submit`,children:o})]})}var R;function Oe(){return(Oe=e((()=>{f(),fe(),r(),R=n(),De.__docgenInfo={description:``,methods:[],displayName:`DirectorySearch`,props:{className:{required:!1,tsType:{name:`string`},description:``},locationLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"¿Dónde?"`,computed:!1}},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: DirectorySearchValue) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  location: string;
  query: string;
}`,signature:{properties:[{key:`location`,value:{name:`string`,required:!0}},{key:`query`,value:{name:`string`,required:!0}}]}},name:`value`}],return:{name:`void`}}},description:``},onSubmit:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: DirectorySearchValue) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  location: string;
  query: string;
}`,signature:{properties:[{key:`location`,value:{name:`string`,required:!0}},{key:`query`,value:{name:`string`,required:!0}}]}},name:`value`}],return:{name:`void`}}},description:``},queryLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"¿Qué buscas?"`,computed:!1}},submitLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"Buscar"`,computed:!1}},value:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  location: string;
  query: string;
}`,signature:{properties:[{key:`location`,value:{name:`string`,required:!0}},{key:`query`,value:{name:`string`,required:!0}}]}},description:``}}}})))()}function ke({className:e,filters:t,label:n=`Filtros`,onValueChange:r,value:a}){return(0,z.jsxs)(`fieldset`,{className:i(`vr-filter-panel`,e),children:[(0,z.jsx)(`legend`,{className:`vr-filter-panel__legend`,children:n}),(0,z.jsx)(`div`,{className:`vr-filter-panel__options`,children:t.map(e=>(0,z.jsx)(de,{checked:a.includes(e.value),disabled:e.disabled,label:e.count===void 0?e.label:`${e.label} (${e.count})`,onCheckedChange:t=>{let n=t===!0?[...a,e.value]:a.filter(t=>t!==e.value);r(Array.from(new Set(n)))}},e.value))})]})}var z;function Ae(){return(Ae=e((()=>{ue(),r(),z=n(),ke.__docgenInfo={description:``,methods:[],displayName:`FilterPanel`,props:{className:{required:!1,tsType:{name:`string`},description:``},filters:{required:!0,tsType:{name:`unknown`},description:``},label:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"Filtros"`,computed:!1}},onValueChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: string[]) => void`,signature:{arguments:[{type:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},name:`value`}],return:{name:`void`}}},description:``},value:{required:!0,tsType:{name:`unknown`},description:``}}}})))()}function B({address:e,className:t,directionsHref:n,mapLabel:r=`Vista aproximada de la ubicación`,...a}){return(0,V.jsxs)(y,{...a,className:i(`vr-location-card`,t),padding:`none`,children:[(0,V.jsx)(`div`,{"aria-label":r,className:`vr-location-card__map`,role:`img`,children:(0,V.jsx)(c,{})}),(0,V.jsxs)(`div`,{className:`vr-location-card__body`,children:[(0,V.jsx)(`strong`,{children:`Ubicación`}),(0,V.jsx)(`address`,{children:e}),n?(0,V.jsx)(`a`,{href:n,children:`Abrir indicaciones`}):null]})]})}var V;function je(){return(je=e((()=>{v(),d(),r(),V=n(),B.__docgenInfo={description:``,methods:[],displayName:`LocationCard`,props:{address:{required:!0,tsType:{name:`string`},description:``},directionsHref:{required:!1,tsType:{name:`string`},description:``},mapLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"Vista aproximada de la ubicación"`,computed:!1}}}}})))()}function Me({promotion:e}){return(0,H.jsxs)(y,{className:`vr-promotion-card`,elevation:`none`,children:[(0,H.jsx)(_,{variant:`accent`,children:e.eyebrow??`Promoción`}),(0,H.jsx)(`h3`,{children:e.title}),e.description?(0,H.jsx)(`p`,{children:e.description}):null,e.href?(0,H.jsxs)(`a`,{href:e.href,children:[`Ver promoción `,(0,H.jsx)(l,{})]}):null]})}var H;function Ne(){return(Ne=e((()=>{g(),v(),d(),H=n(),Me.__docgenInfo={description:``,methods:[],displayName:`PromotionCard`,props:{promotion:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  description?: string;
  eyebrow?: string;
  href?: string;
  id: string;
  title: string;
}`,signature:{properties:[{key:`description`,value:{name:`string`,required:!1}},{key:`eyebrow`,value:{name:`string`,required:!1}},{key:`href`,value:{name:`string`,required:!1}},{key:`id`,value:{name:`string`,required:!0}},{key:`title`,value:{name:`string`,required:!0}}]}},description:``}}}})))()}function U({loading:e=!1,noResults:t=!1}){let[n,r]=(0,W.useState)({location:`Baltimore, MD`,query:``}),[i,c]=(0,W.useState)(`all`),[l,u]=(0,W.useState)([]),[d,f]=(0,W.useState)(`list`),m=(0,W.useMemo)(()=>t?[]:K,[t]),h=(0,G.jsx)(ke,{filters:Fe,onValueChange:u,value:l});return(0,G.jsxs)(`main`,{className:`vr-directory-reference`,children:[(0,G.jsx)(`section`,{className:`vr-directory-reference__hero`,children:(0,G.jsxs)(`div`,{className:`vr-container`,children:[(0,G.jsx)(`p`,{className:`vr-directory-reference__eyebrow`,children:`Baltimore habla español`}),(0,G.jsx)(`h1`,{children:`Lo mejor de nuestra comunidad, cerca de ti.`}),(0,G.jsx)(`p`,{children:`Descubre restaurantes, profesionales y servicios latinos recomendados por tu comunidad.`}),(0,G.jsx)(De,{onChange:r,onSubmit:()=>void 0,value:n})]})}),(0,G.jsxs)(`div`,{className:`vr-container vr-directory-reference__main`,children:[(0,G.jsx)(P,{categories:[{icon:(0,G.jsx)(ee,{}),label:`Cerca de mí`,value:`all`},{icon:(0,G.jsx)(te,{}),label:`Restaurantes`,value:`food`},{icon:(0,G.jsx)(a,{}),label:`Belleza`,value:`beauty`},{icon:(0,G.jsx)(o,{}),label:`Servicios`,value:`services`},{icon:(0,G.jsx)(s,{}),label:`Salud`,value:`health`}],onValueChange:c,value:i}),(0,G.jsxs)(`div`,{className:`vr-directory-reference__toolbar`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h2`,{children:`Negocios para ti`}),(0,G.jsxs)(`p`,{children:[m.length,` resultados en Baltimore y alrededores`]})]}),(0,G.jsxs)(`div`,{className:`vr-directory-reference__toolbar-actions`,children:[(0,G.jsxs)(be,{children:[(0,G.jsx)(_e,{asChild:!0,children:(0,G.jsx)(p,{className:`vr-directory-reference__mobile-filter`,variant:`outline`,children:`Filtros`})}),(0,G.jsxs)(ve,{side:`bottom`,children:[(0,G.jsx)(me,{children:`Filtrar negocios`}),(0,G.jsx)(he,{children:`Combina disponibilidad, verificación y calificación.`}),h,(0,G.jsx)(ge,{asChild:!0,children:(0,G.jsx)(p,{children:`Ver resultados`})})]})]}),(0,G.jsx)(ae,{items:[{label:`Lista`,value:`list`},{label:`Mapa`,value:`map`}],label:`Vista de resultados`,onValueChange:f,value:d})]})]}),(0,G.jsxs)(`div`,{className:`vr-directory-reference__content`,children:[(0,G.jsx)(`aside`,{className:`vr-directory-reference__filters`,children:h}),(0,G.jsx)(`section`,{"aria-label":`Resultados`,className:`vr-directory-reference__results`,children:e?(0,G.jsx)(`div`,{className:`vr-directory-reference__grid`,children:Array.from({length:4},(e,t)=>(0,G.jsx)(le,{"aria-label":`Cargando negocio ${t+1}`,aspectRatio:`4 / 5`,width:`100%`},t))}):m.length===0?(0,G.jsx)(ce,{action:(0,G.jsx)(p,{children:`Limpiar filtros`}),description:`Prueba otra categoría, cambia la ubicación o amplía la distancia.`,title:`No encontramos negocios`}):d===`map`?(0,G.jsx)(B,{address:`Baltimore, Maryland y zonas cercanas`,mapLabel:`Mapa de resultados en Baltimore`}):(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)(`div`,{className:`vr-directory-reference__grid`,children:m.slice(0,2).map((e,t)=>(0,G.jsx)(C,{business:e,variant:t===0?`featured`:`vertical`},e.id))}),(0,G.jsx)(xe,{advertiser:`Mercado Sol`,description:`Ingredientes, panadería y productos de nuestros países todos los días.`,href:`/anuncios/mercado-sol`,title:`Productos latinos cerca de ti`}),(0,G.jsx)(`div`,{className:`vr-directory-reference__grid`,children:m.slice(2).map(e=>(0,G.jsx)(C,{business:e,variant:`vertical`},e.id))})]})})]}),(0,G.jsx)(Me,{promotion:{description:`Presenta esta oferta antes de ordenar.`,eyebrow:`Oferta de la semana`,id:`promo-1`,title:`10% de descuento en tu primera visita`}}),(0,G.jsx)(I,{businessName:`uno de estos negocios`,href:`/reclamar`})]})]})}function Pe(){return(0,G.jsxs)(`main`,{className:`vr-container vr-directory-profile-reference`,children:[(0,G.jsx)(k,{images:[{alt:`Fachada del restaurante`,fallback:`SC`},{alt:`Tacos preparados`,fallback:`T`},{alt:`Interior del restaurante`,fallback:`I`},{alt:`Familia propietaria`,fallback:`F`}]}),(0,G.jsxs)(`div`,{className:`vr-directory-profile-reference__grid`,children:[(0,G.jsx)(Ce,{days:[{day:`Lunes`,hours:`9:00 a. m. – 8:00 p. m.`},{day:`Martes`,hours:`9:00 a. m. – 8:00 p. m.`},{day:`Domingo`,closed:!0}]}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(E,{address:`1220 Eastern Avenue, Baltimore, MD 21224`,directionsHref:`/direcciones`,email:`hola@sabordecasa.example`,phone:`410-555-0142`,website:`https://example.com`}),(0,G.jsx)(B,{address:`1220 Eastern Avenue, Baltimore, MD 21224`,directionsHref:`/direcciones`})]})]}),(0,G.jsx)(I,{businessName:`Sabor de Casa`,href:`/reclamar/sabor-de-casa`})]})}var W,G,K,Fe,Ie,q,J,Y,X,Z,Q,$,Le;function Re(){return(Re=e((()=>{W=t(),ie(),f(),oe(),se(),ye(),d(),Se(),T(),O(),M(),we(),Te(),Ee(),Oe(),Ae(),je(),Ne(),G=n(),K=[{category:`Restaurante mexicano`,description:`Recetas familiares, tortillas hechas a mano y un ambiente donde toda la comunidad se siente en casa.`,href:`/negocios/sabor-de-casa`,id:`sabor-de-casa`,image:{alt:`Comida mexicana de Sabor de Casa`,fallback:`SC`,src:`/missing-sabor.jpg`},location:`Highlandtown · Baltimore`,name:`Sabor de Casa`,rating:4.9,reviewCount:184,status:{label:`Abierto ahora`,tone:`success`},verified:!0},{category:`Impuestos y contabilidad`,description:`Atención bilingüe para familias, trabajadores independientes y pequeños negocios.`,href:`/negocios/martinez-tax-services`,id:`martinez-tax`,image:{alt:`Oficina de Martínez Tax Services`,fallback:`MT`},location:`Dundalk · Maryland`,name:`Martínez Tax Services`,rating:4.8,reviewCount:96,status:{label:`Cierra a las 6`,tone:`warning`}},{category:`Belleza y bienestar`,description:`Color, cortes y tratamientos personalizados en español e inglés.`,href:`/negocios/luna-beauty-studio`,id:`luna-beauty`,image:{alt:`Interior de Luna Beauty Studio`,fallback:`LB`},location:`Essex · Maryland`,name:`Luna Beauty Studio`,rating:4.7,reviewCount:67,status:{label:`Cerrado`,tone:`danger`},verified:!0},{category:`Servicios legales y asesoría comunitaria`,href:`/negocios/centro-integral`,id:`centro-integral`,image:{alt:`Equipo del Centro Integral`,fallback:`CI`},location:`Silver Spring · Maryland`,name:`Centro Integral de Servicios Profesionales para Familias y Pequeñas Empresas Latinas`,status:{label:`Con cita`,tone:`neutral`}}],Fe=[{count:24,label:`Abierto ahora`,value:`open`},{count:31,label:`Verificados`,value:`verified`},{count:18,label:`4.5 estrellas o más`,value:`top-rated`},{count:9,label:`Con promoción`,value:`promotion`}],Ie={title:`Patterns/Directory Reference`,component:U,parameters:{layout:`fullscreen`}},q={},J={args:{loading:!0}},Y={args:{noResults:!0}},X={parameters:{viewport:{defaultViewport:`mobile1`}}},Z={parameters:{viewport:{defaultViewport:`tablet`}}},Q={render:()=>(0,G.jsx)(Pe,{})},$={render:()=>(0,G.jsx)(`main`,{className:`vr-container vr-directory-reference__edge-cases`,children:K.slice(1).map(e=>(0,G.jsx)(C,{business:e,variant:`vertical`},e.id))})},U.__docgenInfo={description:``,methods:[],displayName:`DirectoryReference`,props:{loading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},noResults:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`function DirectoryReference({
  loading = false,
  noResults = false
}: DirectoryReferenceProps) {
  const [search, setSearch] = useState<DirectorySearchValue>({
    location: "Baltimore, MD",
    query: ""
  });
  const [category, setCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [view, setView] = useState("list");
  const visibleBusinesses = useMemo(() => noResults ? [] : businesses, [noResults]);
  const filterFields = <FilterPanel filters={filters} onValueChange={setActiveFilters} value={activeFilters} />;
  return <main className="vr-directory-reference">
      <section className="vr-directory-reference__hero">
        <div className="vr-container">
          <p className="vr-directory-reference__eyebrow">Baltimore habla español</p>
          <h1>Lo mejor de nuestra comunidad, cerca de ti.</h1>
          <p>Descubre restaurantes, profesionales y servicios latinos recomendados por tu comunidad.</p>
          <DirectorySearch onChange={setSearch} onSubmit={() => undefined} value={search} />
        </div>
      </section>

      <div className="vr-container vr-directory-reference__main">
        <CategoryScroller categories={[{
        icon: <LocateFixedIcon />,
        label: "Cerca de mí",
        value: "all"
      }, {
        icon: <UtensilsIcon />,
        label: "Restaurantes",
        value: "food"
      }, {
        icon: <SparklesIcon />,
        label: "Belleza",
        value: "beauty"
      }, {
        icon: <BuildingIcon />,
        label: "Servicios",
        value: "services"
      }, {
        icon: <HeartIcon />,
        label: "Salud",
        value: "health"
      }]} onValueChange={setCategory} value={category} />

        <div className="vr-directory-reference__toolbar">
          <div>
            <h2>Negocios para ti</h2>
            <p>{visibleBusinesses.length} resultados en Baltimore y alrededores</p>
          </div>
          <div className="vr-directory-reference__toolbar-actions">
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="vr-directory-reference__mobile-filter" variant="outline">Filtros</Button>
              </DrawerTrigger>
              <DrawerContent side="bottom">
                <DrawerTitle>Filtrar negocios</DrawerTitle>
                <DrawerDescription>Combina disponibilidad, verificación y calificación.</DrawerDescription>
                {filterFields}
                <DrawerClose asChild><Button>Ver resultados</Button></DrawerClose>
              </DrawerContent>
            </Drawer>
            <ActionRail items={[{
            label: "Lista",
            value: "list"
          }, {
            label: "Mapa",
            value: "map"
          }]} label="Vista de resultados" onValueChange={setView} value={view} />
          </div>
        </div>

        <div className="vr-directory-reference__content">
          <aside className="vr-directory-reference__filters">{filterFields}</aside>
          <section aria-label="Resultados" className="vr-directory-reference__results">
            {loading ? <div className="vr-directory-reference__grid">
                {Array.from({
              length: 4
            }, (_, index) => <Skeleton aria-label={\`Cargando negocio \${index + 1}\`} aspectRatio="4 / 5" key={index} width="100%" />)}
              </div> : visibleBusinesses.length === 0 ? <EmptyState action={<Button>Limpiar filtros</Button>} description="Prueba otra categoría, cambia la ubicación o amplía la distancia." title="No encontramos negocios" /> : view === "map" ? <LocationCard address="Baltimore, Maryland y zonas cercanas" mapLabel="Mapa de resultados en Baltimore" /> : <>
                <div className="vr-directory-reference__grid">
                  {visibleBusinesses.slice(0, 2).map((business, index) => <BusinessCard business={business} key={business.id} variant={index === 0 ? "featured" : "vertical"} />)}
                </div>
                <AdSlot advertiser="Mercado Sol" description="Ingredientes, panadería y productos de nuestros países todos los días." href="/anuncios/mercado-sol" title="Productos latinos cerca de ti" />
                <div className="vr-directory-reference__grid">
                  {visibleBusinesses.slice(2).map(business => <BusinessCard business={business} key={business.id} variant="vertical" />)}
                </div>
              </>}
          </section>
        </div>

        <PromotionCard promotion={{
        description: "Presenta esta oferta antes de ordenar.",
        eyebrow: "Oferta de la semana",
        id: "promo-1",
        title: "10% de descuento en tu primera visita"
      }} />
        <ClaimBusinessCta businessName="uno de estos negocios" href="/reclamar" />
      </div>
    </main>;
}`,...U.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    noResults: true
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "tablet"
    }
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => <BusinessProfileReference />
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: () => <main className="vr-container vr-directory-reference__edge-cases">
      {businesses.slice(1).map(business => <BusinessCard business={business} key={business.id} variant="vertical" />)}
    </main>
}`,...$.parameters?.docs?.source}}},Le=[`DirectoryReference`,`MercadoContemporaneo`,`Loading`,`NoResults`,`Mobile375`,`Tablet768`,`BusinessProfile`,`EdgeCases`]})))()}Re();export{Q as BusinessProfile,U as DirectoryReference,$ as EdgeCases,J as Loading,q as MercadoContemporaneo,X as Mobile375,Y as NoResults,Z as Tablet768,Le as __namedExportsOrder,Ie as default};