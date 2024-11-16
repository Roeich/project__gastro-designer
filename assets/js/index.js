 // function formatPrice(input) {
//     let value = input.value.replace(/[^0-9]/g, '');
//     if (value.length > 5) {
//         value = value.slice(0, 5);
//     }
//     if (value.length >= 3) {
//         value = value.slice(0, 2) + ',' + value.slice(2);
//     } else if (value.length === 2) {
//         value = value.slice(0, 2);
//     } else if (value.length === 1) {
//         value = value.slice(0, 1);
//     }
//     input.value = value;
// }

function formatPrice(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 3) {
        value = value.slice(0, 3);
    }
    input.value = value;
}

function addDish(event) {
    event.preventDefault();
    const form = event.target;
    const title = form["title"].value.trim();
    const note = form["note"].value.trim();
    const price1Desc = form["price1desc"].value.trim();
    const price1 = form["price1"].value.trim(); // Append Euro symbol
    const price2Desc = form["price2desc"].value.trim();
    const price2 = form["price2"].value.trim() ? form["price2"].value.trim() : ''; // Append Euro if price is provided
    const category= form["category"].value.trim();

    if(title!=="" && note!=="" && category!=="" && price1!==""){
        const dish = document.createElement('div');
        dish.className = 'dish';
        var inner_html= `
            <div class="dish_details_row">
                <div class="dish_details">
                    <b class="dish_title">${title}</b>
                    <span class="dish_note">${note}</span>
                </div>
                <div class="dish_price">${price1Desc === "" ? price1 : ""}</div>
            </div>
            `;
        if (price1Desc !== "") {
            inner_html+=`
            <div class="dish_price_item">
                <div class="dish_price_desc dish_price_desc_1">${price1Desc ? price1Desc:""} </div>
                <div class="dish_price dish_price_1">${price1}</div>
            </div>
            `;
        }
        if (price2Desc !== "") {
            inner_html+=`
            <div class="dish_price_item">
                <div class="dish_price_desc dish_price_desc_2">${price2Desc ? price2Desc:""} </div>
                <div class="dish_price dish_price_2">${price2}</div>
            </div>
            `;
        }

        inner_html+=`
            <div class="dish_control">
                <span class="move_btn" onclick="moveUp(this)">⬆️</span>
                <span class="move_btn" onclick="moveDown(this)">⬇️</span>
                <span class="delete_btn" onclick="removeItem(this)">❌</span>
            </div>
        `;

        dish.innerHTML=inner_html;
        document.querySelector(`#${category} .menu_dishs`).appendChild(dish);
        form.reset();
    }
}
function moveUp(element) {
    const dish = element.closest('.dish');
    const previousDish = dish.previousElementSibling;

    if (previousDish && previousDish.classList.contains('dish')) {
        dish.parentNode.insertBefore(dish, previousDish);
    }
}
function moveDown(element) {
    const dish = element.closest('.dish');
    const nextDish = dish.nextElementSibling;

    if (nextDish && nextDish.classList.contains('dish')) {
        dish.parentNode.insertBefore(nextDish, dish);
    }
}
function removeItem(element){
    const dish = element.closest('.dish');
    dish.remove();
}
function generatePDF(designType) {
    let page = document.createElement("div");
    page.classList.add("page");
    page.setAttribute("id", "page");

    let inner_content = `<div class="page_container">`;
    if(designType=="lunch"){
        inner_content +=`<h2 class="page_title">Lunch</h2>`;
    }
    let categoryList;
    if(designType=="home"){
        categoryList=["starter", "main_course", "classic", "dessert"];
    }else if(designType=="lunch"){
        categoryList=["starter", "main", "dessert", "extra"];

    }
    // For each category, create an individual area with a title
    categoryList.forEach((category) => {
        const section = document.getElementById(category);
        const title = section.querySelector(".menu_title").textContent;

        inner_content += `
            <div class="page_menu_section page_menu_${category}">
                <h3 class="page_menu_title">${title}</h3>
                <div class="page_menu_dishs">`;

        // Dish Layout
        Array.from(section.getElementsByClassName("dish")).forEach(dish => {
            const dishTitle = dish.querySelector(".dish_title").textContent;
            const dishNote = dish.querySelector(".dish_note").textContent;
            const dish_price_desc_1 = dish.querySelector(".dish_price_desc_1")!==null ? dish.querySelector(".dish_price_desc_1").textContent.trim():"";
            const dish_price_1 = dish.querySelector(".dish_price_1")?dish.querySelector(".dish_price_1").textContent.trim():"";
            const dish_price_desc_2 = dish.querySelector(".dish_price_desc_2")!==null?dish.querySelector(".dish_price_desc_2").textContent.trim():"";
            const dish_price_2 = dish.querySelector(".dish_price_2")?dish.querySelector(".dish_price_2").textContent.trim():"";

            inner_content += `
                <div class="page_dish">
                    <div class="page_dish_details_row">
                        <div class="page_dish_details">
                            <b class="page_dish_title">${dishTitle}</b>
                            <span class="page_dish_note">${dishNote}</span>
                        </div>
                        <div class="page_dish_price">${dish_price_desc_1 === "" ? dish_price_1 : ""}</div>
                    </div>`;

            if (dish_price_desc_1 !== "") {
                inner_content += `
                    <div class="page_dish_price_item">
                        <div class="page_dish_price_desc">${dish_price_desc_1}</div>
                        <div class="page_dish_price">${dish_price_1}</div>
                    </div>`;
            }
            if (dish_price_desc_2 !== "") {
                inner_content += `
                    <div class="page_dish_price_item">
                        <div class="page_dish_price_desc">${dish_price_desc_2}</div>
                        <div class="page_dish_price">${dish_price_2}</div>
                    </div>`;
            }

            inner_content += `</div>`;
        });

        inner_content += `</div></div>`;
    });

    inner_content += `<div class="page_footer">Alle Preise verstehen sich in Euro und inklusive der gesetzlichen Mehrwertsteue</div></div>`;
    page.innerHTML = inner_content;

    // Append page temporarily to the DOM for rendering
    document.body.appendChild(page);
    // document.getElementById("temporary_wrapper").appendChild(page);

    html2canvas(page, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

        // Generate the PDF filename based on today's date
        const today = new Date();
        const dateString = today.toISOString().slice(2, 10).replace(/-/g, "");
        const iterationKey = `speisekarte_${dateString}`;
        let iteration = parseInt(localStorage.getItem(iterationKey) || "1", 10);
        localStorage.setItem(iterationKey, (iteration + 1).toString());
        const filename = `${dateString}_Speisekarte_${iteration}`;
        pdf.save(`${filename}.pdf`);

        // Remove the page from the DOM after generating the PDF
        document.body.removeChild(page);
    });
}


