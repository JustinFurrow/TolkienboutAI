async function queryCharacter() {
    const characterName = document.getElementById('characterName').value;
    try {
        const response = await fetch('/query-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ characterName })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        document.getElementById('response').innerText = result.success ? result.response : result.message;
    } catch (error) {
        document.getElementById('response').innerText = 'Error: ' + error.message;
    }
}