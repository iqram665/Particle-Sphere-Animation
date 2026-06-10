let scene, camera, renderer, particleSphere, orbitRingsGroup, controls;
let time = 0;

// 1. Exact color palette and multiply scalar (light intensity) of the screenshot
const sphereColors = [
    new THREE.Color(0x00ffff).multiplyScalar(1.2),
    new THREE.Color(0xff1493).multiplyScalar(1.1),
    new THREE.Color(0x4169e1).multiplyScalar(1.2),
    new THREE.Color(0xff69b4).multiplyScalar(1.1),
    new THREE.Color(0x00bfff).multiplyScalar(1.2)
];

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    // Renderer setup
    const canvas = document.getElementById('particleCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mouse controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 2. Create the central glowing particle sphere
    createParticleSphere();

    // 3. Create orbit rings based on the screenshot's custom function
    orbitRingsGroup = createOrbitRings(5.8, 6, 0.4);
    scene.add(orbitRingsGroup);

    // 4. Animation loop
    animate();

    window.addEventListener('resize', onWindowResize);
}

// Function to create the central glowing particle sphere
function createParticleSphere() {
    const geometry = new THREE.BufferGeometry();
    const count = 8000; // Number of particles in the sphere
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        // Mathematical Formula of Spherical Coordinates
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 3.5; // Radius of the sphere

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Exact color palette from the screenshot
        const randomColor = sphereColors[Math.floor(Math.random() * sphereColors.length)];
        colors[i * 3] = randomColor.r;
        colors[i * 3 + 1] = randomColor.g;
        colors[i * 3 + 2] = randomColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle size and glow texture material
    const material = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending // Glow effect to double the light when the particles gather in one place
    });

    particleSphere = new THREE.Points(geometry, material);
    scene.add(particleSphere);
}

// 4. The main function from the screenshot: createOrbitRings(radius, numRings, thickness)
function createOrbitRings(radius, numRings, thickness) {
    const group = new THREE.Group();

    for (let r = 0; r < numRings; r++) {
        const geometry = new THREE.BufferGeometry();
        const count = 1500; // Number of particles in each ring
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const currentRadius = radius + (r * thickness);

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.1);
            
            // Random offset to spread light around the ring
            const driftX = (Math.random() - 0.5) * 0.3;
            const driftY = (Math.random() - 0.5) * 0.3;
            const driftZ = (Math.random() - 0.5) * 0.3;

            positions[i * 3] = Math.cos(angle) * currentRadius + driftX;
            positions[i * 3 + 1] = driftY;
            positions[i * 3 + 2] = Math.sin(angle) * currentRadius + driftZ;

            // Assign random color from the exact palette
            const randomColor = sphereColors[Math.floor(Math.random() * sphereColors.length)];
            colors[i * 3] = randomColor.r;
            colors[i * 3 + 1] = randomColor.g;
            colors[i * 3 + 2] = randomColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const ring = new THREE.Points(geometry, material);
        
        // Setting the rings by bending them at different angles (to give a cosmic look like the rings of Saturn)
        ring.rotation.x = Math.PI * 0.3 + (r * 0.1);
        ring.rotation.z = r * 0.2;

        group.add(ring);
    }

    return group;
}

// 5. The main function from the screenshot: animate()
function animate() {
    requestAnimationFrame(animate);

    // The exact timing value from the screenshot
    time += 0.002;

    // Rotate the central sphere and orbit rings around their respective axes
    if (particleSphere) {
        particleSphere.rotation.y = -time * 0.5;
    }

    if (orbitRingsGroup) {
        // The exact code logic from the screenshot
        orbitRingsGroup.rotation.y = time;
        orbitRingsGroup.rotation.x = time * 0.3;
    }

    // Mouse control update and render
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Run the project
init();