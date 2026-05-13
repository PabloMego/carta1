document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const envelope = document.getElementById('envelope');
    let isOpen = false;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    
    // START FACING THE BACK (Stamp side) SO THEY HAVE TO ROTATE IT
    let targetRotateX = 5;
    let targetRotateY = 170; // Almost perfectly showing the stamp
    
    envelopeWrapper.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
    
    envelope.addEventListener('click', (e) => {
        // Prevent opening if interacting with PDF or clicking download btn
        if (isOpen && e.target.closest('.letter-content')) {
            return;
        }

        // Only open if clicking specifically on the wax seal or the flap (center of the envelope)
        const isCenterClick = e.target.closest('.wax-seal') || e.target.closest('.flap');
        
        if (!isOpen && !isCenterClick) {
            // Give them a tiny hint if they clicked the wrong side
            envelopeWrapper.style.transition = 'transform 0.3s ease';
            targetRotateX += (Math.random() * 10 - 5);
            envelopeWrapper.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
            setTimeout(() => {
                envelopeWrapper.style.transition = 'none';
            }, 300);
            return;
        }

        isOpen = !isOpen;
        if (isOpen) {
            envelope.classList.add('open');
            // Face the letter directly
            targetRotateX = 0;
            targetRotateY = 0;
            envelopeWrapper.style.transition = 'transform 0.8s ease';
            envelopeWrapper.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
            
            // Wait for the opening animation and let them see the photo, then redirect directly to the PDF
            setTimeout(() => {
                window.location.href = './te_amo_pichurri.pdf';
            }, 4500); // 4.5 seconds delay
        } else {
            envelope.classList.remove('open');
            // Go back to an angled view showing the flap again
            targetRotateX = 10;
            targetRotateY = -15;
            envelopeWrapper.style.transition = 'transform 0.8s ease';
            envelopeWrapper.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
        }
    });

    const onPointerDown = (clientX, clientY) => {
        if (isOpen) return;
        isDragging = true;
        startX = clientX - targetRotateY * 2;
        startY = clientY + targetRotateX * 2;
        envelopeWrapper.style.transition = 'none'; // Disable transition during drag
    };

    const onPointerMove = (clientX, clientY) => {
        if (!isDragging || isOpen) return;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        targetRotateY = deltaX * 0.5;
        targetRotateX = -deltaY * 0.5;
        
        // Limit X to avoid confusing upside-down flips
        targetRotateX = Math.max(-45, Math.min(45, targetRotateX));
        
        envelopeWrapper.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
    };

    const onPointerUp = () => {
        isDragging = false;
        // Keep the rotation where they left it
    };

    // Mouse events
    document.addEventListener('mousedown', (e) => {
        // Only trigger drag if it's the envelope
        if (!e.target.closest('.envelope-wrapper')) return;
        onPointerDown(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onPointerUp);

    // Touch events
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.envelope-wrapper')) return;
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => onPointerMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener('touchend', onPointerUp);
});
