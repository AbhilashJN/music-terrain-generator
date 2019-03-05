
const w = window.innerWidth ;
const h = window.innerHeight;
noise.seed(107);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70,w/h,0.1,1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);


// var xmaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const xaxisGeom = new THREE.Geometry();
// xaxisGeom.vertices.push(new THREE.Vector3(0,10,0));
// xaxisGeom.vertices.push(new THREE.Vector3(100,10,0)); 
// const xaxis = new THREE.Line(xaxisGeom,xmaterial);

// var ymaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
// const yaxisGeom = new THREE.Geometry();
// yaxisGeom.vertices.push(new THREE.Vector3(0,10,0));
// yaxisGeom.vertices.push(new THREE.Vector3(0,100,0)); 
// const yaxis = new THREE.Line(yaxisGeom,ymaterial);

// var zmaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// const zaxisGeom = new THREE.Geometry();
// zaxisGeom.vertices.push(new THREE.Vector3(0,10,0));
// zaxisGeom.vertices.push(new THREE.Vector3(0,10,100)); 
// const zaxis = new THREE.Line(zaxisGeom,zmaterial);

// scene.add( xaxis )
// scene.add( yaxis )
// scene.add( zaxis )


const scl = 5;
// const rows = Math.floor(h/scl);
// const cols = Math.floor(w/scl);
const rows = 128;
const cols = 128;
console.log(rows,cols);

camera.position.set(cols/2*scl, -700, 400);
camera.lookAt( cols/2*scl, 0, 0 );
// camera.position.set(200,0,1000);
// camera.lookAt( 200,0,0, );




const points=[];
for(let y=0;y<rows-1;y++)
{
    for(let x=0;x<cols-1;x++){
            let xc = x*scl;
            let xcn = (x+1)*scl;
            let ycn = (y+1)*scl;
            let yc = y*scl;
            let zc = 0;

            //1st traingle
            points.push(xc)
            points.push(-yc)
            points.push(0)
            

            points.push(xc)
            points.push(-ycn)
            points.push(0)

            points.push(xcn)
            points.push(-yc)
            points.push(0)


    }

}

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array(points);
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

const vertexShader = `
varying vec2 vUv;
varying vec4 worldCoord;

void main()
{
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  worldCoord = modelMatrix * vec4( position, 1.0 );
}
  `


const fragmentShader = `
varying vec4 worldCoord;
uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;

vec3 getColor(float height){
	if(height<0.5)
	{
		return colorA*(0.5-height)*2.0 + colorB*height*2.0;
	}
	else{
		return colorB*(1.0-height)*2.0 + colorC*(height-0.5)*2.0;
	}
}

void main() {
	float normHeight = worldCoord.z / 255.0;
	vec3 color = getColor(normHeight);
  gl_FragColor = vec4(color, 1.0);

}
`

const colors = {
    colorA: {type: 'vec3', value: new THREE.Color(0xE82020)},
    colorB: {type: 'vec3', value: new THREE.Color(0xF2C64D)},
    colorC: {type: 'vec3', value: new THREE.Color(0x4DA2F2)}
}

const material =  new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    uniforms:colors,
    // wireframe:true
  })

const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh)


function newFilledArray(length, val) {
    const array = [];
    for (let i = 0; i < length; i++) {
        array[i] = val;
    }
    return array;
}



const allHeights=[]

for(let i=0;i<128;i++)
{
    const row = newFilledArray(128,0)
    allHeights.push(row)
}


const animate = ()=>{
    requestAnimationFrame(animate);

    analyzer.getByteFrequencyData(dataArray);
    const latestHeights = []
    dataArray.forEach((value,index)=>{
        latestHeights.push(value)
    })
    allHeights.unshift(latestHeights)
    if(allHeights.length>128)
    {
        allHeights.pop();
    }
    
    mesh.geometry.attributes.position.needsUpdate = true;

		const points = mesh.geometry.attributes.position.array;

    for(let y=0;y<rows-1;y++)
    {
        for(let x=0;x<cols-1;x++){
            let xc = x*scl;
            let xcn = (x+1)*scl;
            let ycn = (y+1)*scl;
            let yc = y*scl;
            let zc = 0;
            const baseIndex = (y*(cols-1)+x) * 9
            const index1 = baseIndex + 2
            const index2 = baseIndex + 5
            const index3 = baseIndex + 8
            points[index1]=(allHeights[y][x])
            points[index2] = (allHeights[y+1][x])
            points[index3]=(allHeights[y][x+1])
        }
    }
    renderer.render(scene,camera);
}

animate();



