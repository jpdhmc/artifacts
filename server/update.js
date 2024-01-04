const updateJson = () => {
    fetch("http://localhost:3000/update", {
        method: 'GET',
        mode: 'no-cors'
    })
        .then(response => {
            if (response) {
                console.log("No-cors response");
            } else {
                console.error("No response.")
            }
        }).catch(error => {
            console.error("Error: " + error);
        });
}