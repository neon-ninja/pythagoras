import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Pythagorean triple (a=3, b=4, c=5)
const a = 3;
const b = 4;
const c = 5;

// Create the triangle and squares
const group = new THREE.Group();

// Triangle
const triangleShape = new THREE.Shape();
triangleShape.moveTo(0, 0);
triangleShape.lineTo(a, 0);
triangleShape.lineTo(0, b);
triangleShape.lineTo(0, 0);
const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
const triangleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
group.add(triangleMesh);

// Square on side A
const squareA_Geometry = new THREE.PlaneGeometry(a, a);
const squareA_Material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const squareA = new THREE.Mesh(squareA_Geometry, squareA_Material);
squareA.position.set(a / 2, -a / 2, 0);
group.add(squareA);

// Square on side B
const squareB_Geometry = new THREE.PlaneGeometry(b, b);
const squareB_Material = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const squareB = new THREE.Mesh(squareB_Geometry, squareB_Material);
squareB.position.set(-b / 2, b / 2, 0);
group.add(squareB);

// Square on side C (hypotenuse)
const squareC_Geometry = new THREE.PlaneGeometry(c, c);
const squareC_Material = new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const squareC = new THREE.Mesh(squareC_Geometry, squareC_Material);
const angle = Math.atan2(b, -a);
squareC.position.set(a / 2, b / 2, 0);
squareC.rotation.z = angle;
squareC.position.x += (c/2) * Math.sin(angle);
squareC.position.y -= (c/2) * Math.cos(angle);
group.add(squareC);


scene.add(group);

// Center the group
const box = new THREE.Box3().setFromObject(group);
const center = box.getCenter(new THREE.Vector3());
group.position.sub(center);


camera.position.z = 15;

// Water simulation (placeholder)
const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 });

// Water in square C
const waterC_Geometry = new THREE.PlaneGeometry(c, c);
const waterC = new THREE.Mesh(waterC_Geometry, waterMaterial);
waterC.position.copy(squareC.position);
waterC.rotation.copy(squareC.rotation);
waterC.position.z += 0.1; // Slightly in front
group.add(waterC);

// Water in square A
const waterA_Geometry = new THREE.PlaneGeometry(a, 0); // Initially empty
const waterA = new THREE.Mesh(waterA_Geometry, waterMaterial);
waterA.position.copy(squareA.position);
waterA.rotation.copy(squareA.rotation);
waterA.position.z += 0.1;
group.add(waterA);

// Water in square B
const waterB_Geometry = new THREE.PlaneGeometry(b, 0); // Initially empty
const waterB = new THREE.Mesh(waterB_Geometry, waterMaterial);
waterB.position.copy(squareB.position);
waterB.rotation.copy(squareB.rotation);
waterB.position.z += 0.1;
group.add(waterB);


function animate() {
    requestAnimationFrame(animate);

    // Simple rotation for demonstration
    group.rotation.z += 0.005;

    // Placeholder for fluid logic
    const rotationZ = group.rotation.z % (2 * Math.PI);

    // This is a very simplified simulation.
    // It calculates the "fill" based on the rotation angle.
    let fillRatio = 0;
    if (rotationZ > Math.PI / 4 && rotationZ < 3 * Math.PI / 4) {
        fillRatio = (rotationZ - Math.PI / 4) / (Math.PI / 2);
    } else if (rotationZ > 5 * Math.PI / 4 && rotationZ < 7 * Math.PI / 4) {
        fillRatio = 1 - ((rotationZ - 5 * Math.PI / 4) / (Math.PI / 2));
    }
    fillRatio = Math.max(0, Math.min(1, fillRatio));


    // Update water levels
    const waterCHeight = c * (1 - fillRatio);
    waterC.geometry.dispose();
    waterC.geometry = new THREE.PlaneGeometry(c, waterCHeight);
    waterC.position.y = squareC.position.y - (c - waterCHeight) / 2 * Math.cos(squareC.rotation.z);
    waterC.position.x = squareC.position.x + (c - waterCHeight) / 2 * Math.sin(squareC.rotation.z);


    const waterAHeight = a * fillRatio;
    waterA.geometry.dispose();
    waterA.geometry = new THREE.PlaneGeometry(a, waterAHeight);
    waterA.position.y = squareA.position.y - (a - waterAHeight) / 2;


    const waterBHeight = b * fillRatio;
    waterB.geometry.dispose();
    waterB.geometry = new THREE.PlaneGeometry(b, waterBHeight);
    waterB.position.x = squareB.position.x - (b - waterBHeight) / 2;


    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
