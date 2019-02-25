
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
// xaxisGeom.vertices.push(new THREE.Vector3(0,0,0));
// xaxisGeom.vertices.push(new THREE.Vector3(100,0,0)); 
// const xaxis = new THREE.Line(xaxisGeom,xmaterial);

// var ymaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
// const yaxisGeom = new THREE.Geometry();
// yaxisGeom.vertices.push(new THREE.Vector3(0,0,0));
// yaxisGeom.vertices.push(new THREE.Vector3(0,100,0)); 
// const yaxis = new THREE.Line(yaxisGeom,ymaterial);

// var zmaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// const zaxisGeom = new THREE.Geometry();
// zaxisGeom.vertices.push(new THREE.Vector3(0,0,0));
// zaxisGeom.vertices.push(new THREE.Vector3(0,0,100)); 
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

camera.position.set(cols/2*scl, -rows*scl, 300);
camera.lookAt( cols/2*scl, 0, 0 );



let noiseOrigin = 0;

const heights = [];
let yoff=noiseOrigin;
for(let y=0;y<rows;y++){
    let xoff=0;
    const heightsRow =[]
    for(let x=0;x<cols;x++){
        heightsRow.push(noise.perlin2(xoff,yoff)*25)
        xoff+=0.1
    }
    heights.push(heightsRow);
    yoff+=0.1
}

const points=[];
for(let y=0;y<rows-1;y++)
{
    for(let x=0;x<cols-1;x++){
            let xc = x*scl;
            let xcn = (x+1)*scl;
            let ycn = (y+1)*scl;
            let yc = y*scl;
            let zc = 0;

            points.push(xc)
            points.push(-yc)
            points.push(heights[y][x])
            

            points.push(xc)
            points.push(-ycn)
            points.push(heights[y+1][x])

            points.push(xcn)
            points.push(-yc)
            points.push(heights[y][x+1])
    }

}

var geometry = new THREE.BufferGeometry();
const vertices = new Float32Array(points);
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
var mesh = new THREE.Mesh( geometry, material );
scene.add(mesh)


function newFilledArray(length, val) {
    var array = [];
    for (var i = 0; i < length; i++) {
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

console.log(allHeights)


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



