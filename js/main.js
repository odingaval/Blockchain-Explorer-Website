document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        this.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            newsletterMessage.textContent = 'Subscribing...';
            newsletterMessage.style.color = 'var(--primary-color)';
            
            setTimeout(() => {
                newsletterMessage.textContent = `Thanks for subscribing! We've sent a confirmation to ${email}`;
                newsletterMessage.style.color = 'var(--success-color)';
                this.reset();
                
                // Track subscription with analytics (simulated)
                console.log('New subscriber:', email);
            }, 1500);
        });
    }
    
    // Blockchain Demo Functionality
    const blockchainVisual = document.getElementById('blockchain-visual');
    const addBlockBtn = document.getElementById('add-block-btn');
    const mineBlockBtn = document.getElementById('mine-block-btn');
    const tamperBtn = document.getElementById('tamper-btn');
    const demoOutput = document.getElementById('demo-output');
    
    let blockchain = [];
    let blockCounter = 0;
    
    // Helper function to generate a simple hash
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash &= hash; // Convert to 32bit integer
        }
        return new Uint32Array([hash])[0].toString(36);
    }
    
    // Create a new block
    function createBlock(data, previousHash = '0') {
        blockCounter++;
        const timestamp = new Date().toLocaleTimeString();
        const hash = simpleHash(`${previousHash}${timestamp}${JSON.stringify(data)}`);
        
        return {
            index: blockCounter,
            timestamp,
            data,
            previousHash,
            hash,
            nonce: 0
        };
    }
    
    // Mine a block (simple proof-of-work simulation)
    function mineBlock(block) {
        let nonce = 0;
        let hash = '';
        
        // Simple mining simulation - find hash starting with "00"
        while (!hash.startsWith('00') && nonce < 1000) {
            nonce++;
            hash = simpleHash(`${block.previousHash}${block.timestamp}${JSON.stringify(block.data)}${nonce}`);
        }
        
        return {
            ...block,
            nonce,
            hash
        };
    }
    
    // Render the blockchain visualization
    function renderBlockchain() {
        blockchainVisual.innerHTML = '';
        
        if (blockchain.length === 0) {
            blockchainVisual.innerHTML = '<p class="empty-chain">No blocks in the chain yet. Click "Add Block" to start.</p>';
            return;
        }
        
        blockchain.forEach((block, index) => {
            const blockElement = document.createElement('div');
            blockElement.className = 'block';
            blockElement.innerHTML = `
                <div class="block-header">Block #${block.index}</div>
                <div class="block-data">Data: ${JSON.stringify(block.data)}</div>
                <div class="block-hash">Hash: ${block.hash}</div>
                <div class="block-hash">Prev: ${block.previousHash}</div>
                ${block.nonce > 0 ? `<div class="block-nonce">Nonce: ${block.nonce}</div>` : ''}
            `;
            
            // Highlight the genesis block
            if (index === 0) {
                blockElement.style.borderLeftColor = 'var(--success-color)';
            }
            
            blockchainVisual.appendChild(blockElement);
        });
    }
    
    // Add block button handler
    if (addBlockBtn) {
        addBlockBtn.addEventListener('click', function() {
            const previousHash = blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : '0';
            const newBlock = createBlock(
                { transaction: `TX${blockCounter + 1}`, amount: Math.floor(Math.random() * 100) },
                previousHash
            );
            
            blockchain.push(newBlock);
            renderBlockchain();
            
            demoOutput.textContent = `Added new block #${newBlock.index} to the chain. Now mine it to secure the blockchain.`;
            demoOutput.style.color = 'var(--primary-color)';
            
            // Enable mine button
            mineBlockBtn.disabled = false;
            tamperBtn.disabled = false;
        });
    }
    
    // Mine block button handler
    if (mineBlockBtn) {
        mineBlockBtn.disabled = true;
        
        mineBlockBtn.addEventListener('click', function() {
            if (blockchain.length === 0) return;
            
            // Get the last unmined block
            const lastBlock = blockchain[blockchain.length - 1];
            if (lastBlock.hash.startsWith('00')) {
                demoOutput.textContent = 'Block is already mined!';
                demoOutput.style.color = 'var(--warning-color)';
                return;
            }
            
            demoOutput.textContent = 'Mining block... (This may take a moment)';
            demoOutput.style.color = 'var(--primary-color)';
            
            // Simulate mining delay
            setTimeout(() => {
                const minedBlock = mineBlock(lastBlock);
                blockchain[blockchain.length - 1] = minedBlock;
                renderBlockchain();
                
                demoOutput.innerHTML = `
                    Successfully mined block #${minedBlock.index}!<br>
                    Found hash: <strong>${minedBlock.hash}</strong><br>
                    After <strong>${minedBlock.nonce}</strong> attempts.
                `;
                demoOutput.style.color = 'var(--success-color)';
            }, 1000);
        });
    }
    
    // Tamper button handler
    if (tamperBtn) {
        tamperBtn.disabled = true;
        
        tamperBtn.addEventListener('click', function() {
            if (blockchain.length < 2) {
                demoOutput.textContent = 'Need at least 2 blocks to demonstrate tampering';
                demoOutput.style.color = 'var(--warning-color)';
                return;
            }
            
            // Tamper with the data in the first block
            const tamperedBlock = { ...blockchain[1] };
            tamperedBlock.data.amount = 9999; // Unrealistically high amount
            tamperedBlock.hash = simpleHash(`${tamperedBlock.previousHash}${tamperedBlock.timestamp}${JSON.stringify(tamperedBlock.data)}${tamperedBlock.nonce}`);
            
            // Update the visualization to show tampering
            const blockElements = document.querySelectorAll('.block');
            if (blockElements.length > 1) {
                blockElements[1].innerHTML = `
                    <div class="block-header">Block #${tamperedBlock.index} (TAMPERED!)</div>
                    <div class="block-data">Data: ${JSON.stringify(tamperedBlock.data)}</div>
                    <div class="block-hash">Hash: ${tamperedBlock.hash}</div>
                    <div class="block-hash">Prev: ${tamperedBlock.previousHash}</div>
                    ${tamperedBlock.nonce > 0 ? `<div class="block-nonce">Nonce: ${tamperedBlock.nonce}</div>` : ''}
                `;
                blockElements[1].style.borderLeftColor = 'var(--danger-color)';
                
                // Show the broken chain
                demoOutput.innerHTML = `
                    <span style="color: var(--danger-color)">Blockchain integrity compromised!</span><br>
                    Block #2's hash no longer matches its data because we changed the transaction amount.<br>
                    The next block's "previousHash" would no longer be valid.
                `;
            }
        });
    }
    
    // Dark Mode Toggle (Bonus Feature)
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.title = 'Toggle Dark Mode';
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.bottom = '20px';
    darkModeToggle.style.right = '20px';
    darkModeToggle.style.zIndex = '99';
    darkModeToggle.style.background = 'var(--primary-color)';
    darkModeToggle.style.color = 'white';
    darkModeToggle.style.border = 'none';
    darkModeToggle.style.borderRadius = '50%';
    darkModeToggle.style.width = '50px';
    darkModeToggle.style.height = '50px';
    darkModeToggle.style.cursor = 'pointer';
    darkModeToggle.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    document.body.appendChild(darkModeToggle);
});
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simulate form submission
            formMessage.textContent = 'Sending your message...';
            formMessage.style.color = 'var(--primary-color)';
            
            setTimeout(() => {
                formMessage.textContent = `Thank you, ${formValues.name}! Your message has been sent. We'll respond to ${formValues.email} soon.`;
                formMessage.style.color = 'var(--success-color)';
                this.reset();
                
                // Track contact form submission (simulated)
                console.log('Contact form submitted:', formValues);
            }, 1500);
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Toggle active class
            item.classList.toggle('active');
            
            // Toggle answer visibility
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                answer.style.maxHeight = '0';
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
            
            // Close other items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherItem = otherQuestion.parentNode;
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    
                    otherItem.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        });
    });
});        

    // Article-specific JavaScript 
    document.addEventListener('DOMContentLoaded', function() {
        // Simple hash calculation for the demo
        function calculateDemoHash() {
            const data = document.getElementById('block-data').value;
            const prevHash = document.getElementById('prev-hash').value;
            const nonce = document.getElementById('nonce').value;
            const input = `${prevHash}${data}${nonce}`;
            
            // Simple hash for demonstration
            let hash = 0;
            for (let i = 0; i < input.length; i++) {
                const char = input.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash &= hash;
            }
            return hash.toString(36);
        }
        
        // Calculate Hash button
        document.getElementById('calculate-hash').addEventListener('click', function() {
            const hash = calculateDemoHash();
            document.getElementById('current-hash').value = hash;
            document.getElementById('block-demo-output').innerHTML = 
                `<p>Hash calculated! This is the cryptographic fingerprint of the block's data.</p>
                 <p>Try changing the data and recalculating to see how the hash completely changes.</p>`;
        });
        
        // Mine Block button
        document.getElementById('mine-block').addEventListener('click', function() {
            let nonce = 0;
            let hash = '';
            const data = document.getElementById('block-data').value;
            const prevHash = document.getElementById('prev-hash').value;
            
            // Simple mining simulation - find hash starting with "00"
            while (!hash.startsWith('00') && nonce < 1000) {
                nonce++;
                const input = `${prevHash}${data}${nonce}`;
                
                // Calculate hash
                let h = 0;
                for (let i = 0; i < input.length; i++) {
                    const char = input.charCodeAt(i);
                    h = (h << 5) - h + char;
                    h &= h;
                }
                hash = h.toString(36);
            }
            
            if (hash.startsWith('00')) {
                document.getElementById('nonce').value = nonce;
                document.getElementById('current-hash').value = hash;
                document.getElementById('block-demo-output').innerHTML = 
                    `<p>Block mined successfully after ${nonce} attempts!</p>
                     <p>Found hash: <strong>${hash}</strong> that meets the difficulty requirement (starts with "00").</p>`;
            } else {
                document.getElementById('block-demo-output').innerHTML = 
                    `<p>Mining failed after 1000 attempts. Try simpler data.</p>`;
            }
        });
        
        // Tamper Data button
        document.getElementById('tamper-data').addEventListener('click', function() {
            document.getElementById('block-data').value = "Tampered data!";
            document.getElementById('current-hash').value = "";
            document.getElementById('nonce').value = "0";
            document.getElementById('block-demo-output').innerHTML = 
                `<p style="color: var(--danger-color)">Data tampered! The existing hash is no longer valid.</p>
                 <p>Click "Calculate Hash" to see the new hash, or "Mine Block" to find a new valid nonce.</p>`;
        });
        
        // Consensus mechanisms chart
        const ctx = document.getElementById('consensusChart').getContext('2d');
        const consensusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Energy Efficiency', 'Decentralization', 'Security', 'Transaction Speed'],
                datasets: [
                    {
                        label: 'Proof of Work',
                        data: [20, 85, 95, 40],
                        backgroundColor: 'rgba(239, 71, 111, 0.7)',
                    },
                    {
                        label: 'Proof of Stake',
                        data: [80, 70, 85, 75],
                        backgroundColor: 'rgba(6, 214, 160, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
        
        // Initialize Disqus comments
        if (document.getElementById('disqus_thread')) {
            window.disqus_config = function() {
                this.page.url = window.location.href;
                this.page.identifier = 'blockchain-basics';
            };
            
            const d = document, s = d.createElement('script');
            s.src = 'https://your-disqus-shortname.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        }
    });

        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Disqus comments
            if (document.getElementById('disqus_thread')) {
                window.disqus_config = function() {
                    this.page.url = window.location.href;
                    this.page.identifier = 'smart-contracts';
                };
                
                const d = document, s = d.createElement('script');
                s.src = 'https://your-disqus-shortname.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            }
            
            // Interactive code selector
            const codeTabs = document.querySelectorAll('.code-tab');
            if (codeTabs.length > 0) {
                codeTabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        const target = this.dataset.target;
                        const codeContainer = this.closest('.code-container');
                        
                        // Update active tab
                        codeContainer.querySelectorAll('.code-tab').forEach(t => {
                            t.classList.remove('active');
                        });
                        this.classList.add('active');
                        
                        // Show selected code
                        codeContainer.querySelectorAll('.code-content').forEach(c => {
                            c.style.display = 'none';
                        });
                        document.getElementById(target).style.display = 'block';
                    });
                });
            }
        });
    
    
        document.addEventListener('DOMContentLoaded', function() {
            // Seed phrase generator
            const generateSeedBtn = document.getElementById('generate-seed');
            const seedPhraseContainer = document.getElementById('seed-phrase');
            
            if (generateSeedBtn && seedPhraseContainer) {
                generateSeedBtn.addEventListener('click', function() {
                    // Generate random entropy (insecure for real use - demo only)
                    const randomEntropy = window.crypto.getRandomValues(new Uint8Array(16));
                    const mnemonic = bip39.entropyToMnemonic(randomEntropy);
                    
                    // Display the words
                    seedPhraseContainer.innerHTML = '';
                    mnemonic.split(' ').forEach((word, index) => {
                        const wordElement = document.createElement('span');
                        wordElement.className = 'seed-word';
                        wordElement.innerHTML = `
                            <span class="word-number">${index + 1}.</span>
                            <span class="word-text">${word}</span>
                        `;
                        seedPhraseContainer.appendChild(wordElement);
                    });
                });
                
                // Generate initial phrase
                generateSeedBtn.click();
            }
            
            // Initialize Disqus comments
            if (document.getElementById('disqus_thread')) {
                window.disqus_config = function() {
                    this.page.url = window.location.href;
                    this.page.identifier = 'crypto-security';
                };
                
                const d = document, s = d.createElement('script');
                s.src = 'https://your-disqus-shortname.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            }
        });
    
    
            document.addEventListener('DOMContentLoaded', function() {
                // Newsletter form submission
                const newsletterForm = document.getElementById('resources-newsletter-form');
                const newsletterMessage = document.getElementById('resources-newsletter-message');
                
                if (newsletterForm) {
                    newsletterForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const email = this.querySelector('input[type="email"]').value;
                        
                        // Simulate form submission
                        newsletterMessage.textContent = 'Subscribing...';
                        newsletterMessage.style.color = 'var(--primary-color)';
                        
                        setTimeout(() => {
                            newsletterMessage.textContent = `Thanks for subscribing! You'll receive our next resource update at ${email}`;
                            newsletterMessage.style.color = 'var(--success-color)';
                            this.reset();
                        }, 1500);
                    });
                }
               
            });
        