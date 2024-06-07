const token = localStorage.getItem('myAppToken');
const username = localStorage.getItem('user');
const searchbar = document.getElementById("myInput");
const infomessage = document.getElementById('infosearch');

localStorage.clear()

if (!username) {
    window.location.href = '../index.html';
}

searchbar.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        infomessage.style.display = 'block'
        infomessage.textContent = 'Buscant stock...'
        try {
            validate(e);
        }
        catch {
            infomessage.textContent = 'Format Invàlid'
        }
    }
});

function validate(e) {
    let text = e.target.value;
    let words = text.split(' ');
    console.log(words[0]);
    console.log(words[1]);

    //base URL
    const apiUrl = new URL('http://server01:85/api/Producto/GetStockProducto');
    //append params to URL
    apiUrl.searchParams.append('login', username);
    apiUrl.searchParams.append('producto', words[0].toUpperCase());
    apiUrl.searchParams.append('color', words[1].toUpperCase());
    //fetch function
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');

            }
            return response.json();
        })
        .then(data => {
            infomessage.style.display = 'none'
            console.log('Response:', data);
            // Process the retrieved data as needed
            if (data.length == 0) {
                infomessage.style.display = 'block'
                infomessage.textContent = 'No trobat'
            }
            showstock(data)
        })
        .catch(error => {
            console.error('Error:', error);
            //window.location.href = '../index.html'; 
            infomessage.style.display = 'block'
            infomessage.textContent = error
        });
}

function showstock(json) {
    const tableBody = document.getElementById("table-body");

    // Clear existing rows
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    json.sort((a, b) => {
        const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL","6", "8", "10", "12", "14", "16", "18"];
        const sizeA = sizes.indexOf(a.talla);
        const sizeB = sizes.indexOf(b.talla);
        return sizeA - sizeB;
    });

    json.forEach((item) => {
        if (item.estoc < 0) {
            item.estoc = 0;
        }
        const row = document.createElement("tr");

        // Create <td> elements for each value
        const codigoCell = document.createElement("td");
        const colorCell = document.createElement("td");
        const tallaCell = document.createElement("td");
        const estocCell = document.createElement("td");
        const eanCell = document.createElement("td");

        // Set text content for each cell
        codigoCell.textContent = item.codigo;
        colorCell.textContent = item.color;
        tallaCell.textContent = item.talla;
        estocCell.textContent = item.estoc;
        eanCell.textContent = item.ean;

        // Append cells to the row
        row.appendChild(codigoCell);
        row.appendChild(colorCell);
        row.appendChild(tallaCell);
        row.appendChild(estocCell);
        row.appendChild(eanCell)

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}