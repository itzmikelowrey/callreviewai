document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const resultsSection = document.getElementById('results-section');
    const transcript = document.getElementById('transcript');
    const feedback = document.getElementById('feedback');
    const audioElement = document.getElementById('audio-element');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    // Handle file selection via button
    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            uploadFile(file);
        }
    }

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('audio', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Transcription:', data.transcription);
            // TODO: Display transcription and AI analysis results
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function displayResults(data) {
        // In a real app, this is where you'd call your backend to process the file
        resultsSection.hidden = false;
        transcript.innerHTML = '<h3>Transcript</h3><p>This is a simulated transcript of the call...</p>';
        feedback.innerHTML = '<h3>AI Feedback</h3><p>Here\'s some simulated AI feedback on the call...</p>';
        audioElement.src = URL.createObjectURL(file);
    }
});
