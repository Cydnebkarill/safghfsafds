$(function() {
    document.getElementById("deleteCategoryBtn").addEventListener("click", removeCategory);
    document.getElementById("addCategoryBtn").addEventListener("click", addCategory);
    document.getElementById("addProductBtn").addEventListener("click", addProduct);
    loadCategories();
    loadProducts();
});

/* ---- START Functions belonging to Category ---- */
function loadCategories() {
    var categoryList = getCategoryListFromStorage();

    for (var id in categoryList) {
        $.ajax({
            type: "GET",
            url: "http://zhaw-weng-shop-api.herokuapp.com/api/categories/" + categoryList[id].id,
            contentType: "application/json",
            success: function(response) {
                var select = document.getElementById("categoryList");
                var option = document.createElement("option");
                option.text = response.title;
                option.value = response.id;
                select.add(option);
                reloadCategories();
            }
        });
    }
}

function addCategory() {
    var categoryName = document.getElementById("categoryText");

    if (categoryName.value === "") {
        return;
    }

    var categoryId = generate_uuid();
    var category = {
        "id": 0,
        "title": categoryName.value,
        "client_id": categoryId,
        "description": "",
        "image_url": "",
        "data": ""
    }
    $.ajax({
        type: "POST",
        data: JSON.stringify(category),
        url: "http://zhaw-weng-shop-api.herokuapp.com/api/categories",
        contentType: "application/json",
        success: function(response) {
            category.id = response.id;

            var categoryList = getCategoryListFromStorage();
            categoryList[category.id] = category;
            localStorage.setItem("categoryList", JSON.stringify(categoryList));

            var select = document.getElementById("categoryList");
            var option = document.createElement("option");
            option.text = category.title;
            option.value = category.id;
            select.add(option);
            select.selectedIndex = select.length - 1;
            reloadCategories();
            categoryName.value = "";
        }
    });
}

function removeCategory() {
    var select = document.getElementById("categoryList");
    var categoryId = parseInt(select[select.selectedIndex].value);

    $.ajax({
        type: "GET",
        url: "http://zhaw-weng-shop-api.herokuapp.com/api/category/" + categoryId + "/products",
        contentType: "application/json",
        success: function(response) {
            for (var i = 0; i < response.length; i++) {
                removeProduct(response[i].title);
            }
            var categoryList = getCategoryListFromStorage();
            $.ajax({
                type: "DELETE",
                url: "http://zhaw-weng-shop-api.herokuapp.com/api/categories/" + categoryId,
                contentType: "application/json",
            });
            delete categoryList[categoryId];
            localStorage.setItem("categoryList", JSON.stringify(categoryList));
            select.remove(select.selectedIndex);
            reloadCategories();
            reloadProducts();
        }
    });
}

function getCategoryListFromStorage() {
    var categoryListFromStorage = localStorage.getItem("categoryList");
    var categoryList = {};
    if (categoryListFromStorage !== null) {
        categoryList = JSON.parse(categoryListFromStorage);
    }
    return categoryList;
}

function reloadCategories() {
    $('#productsCategoryList').empty();
    $('#categoryList').find('option').clone().appendTo('#productsCategoryList');
}

/* ---- END Functions belonging to Category ---- */

/* ---- START Functions belonging to Product ---- */
function loadProducts() {
    var productList = getProductListFromStorage();
    var categories = [];
    for (var id in productList) {
        if (categories.indexOf(productList[id].category_id) === -1) {
            categories.push(productList[id].category_id);
        }
    }

    for (var i = 0; i < categories.length; i++) {
        $.ajax({
            type: "GET",
            url: "http://zhaw-weng-shop-api.herokuapp.com/api/category/" + categories[i] + "/products",
            contentType: "application/json",
            success: function(response) {
                for (var i = 0; i < response.length; i++) {
                    addProductToHTML(response[i].title, response[i].image_url, response[i].description, response[i].category_id)
                }
            }
        });
    }
}

function addProduct() {
    var productTitle = document.getElementById("productTitle");
    var productImg = document.getElementById("productImg");
    var productDesc = document.getElementById("productDesc");
    var categoryId = document.getElementById("productsCategoryList").value;

    if (categoryId === "") {
      return;
    }
    if (productTitle.value === "" && productImg.value === "" && productDesc.value === ""){
        return;
    }

    var client_id = generate_uuid();
    var categoryList = getCategoryListFromStorage();
    var product = {
        "id": 0,
        "title": productTitle.value,
        "description": productDesc.value,
        "image_url": productImg.value,
        "client_id": client_id,
        "category_id": categoryList[categoryId].id,
        "category_client_id": categoryList[categoryId].client_id,
        "in_stock": true,
        "quantity": 0,
        "price": 0,
        "data": "string"
    }
    $.ajax({
        type: "POST",
        data: JSON.stringify(product),
        url: "http://zhaw-weng-shop-api.herokuapp.com/api/category/" + product.category_id + "/products",
        contentType: "application/json",
        success: function(response) {
            product.id = response.id;

            var productList = getProductListFromStorage();
            productList[product.id] = product;
            localStorage.setItem("productList", JSON.stringify(productList));
        }
    });

    addProductToHTML(product.title, product.image_url, product.description, categoryId);

    productTitle.value = "";
    productImg.value = "";
    productDesc.value = "";
}

function updateProduct() {
    var product;
    var productList = getProductListFromStorage();
    var oldProductValues = JSON.parse(document.getElementById("oldProductValues").value);

    for (var id in productList) {
        if (productList[id].title == oldProductValues.productTitle && productList[id].image_url == oldProductValues.productImg && productList[id].description == oldProductValues.productDesc) {
            product = productList[id];
            product.title = document.getElementById("productTitle").value;
            product.image_url = document.getElementById("productImg").value;
            product.description = document.getElementById("productDesc").value;
        }
    }
    $.ajax({
        type: "PUT",
        data: JSON.stringify(product),
        url: "http://zhaw-weng-shop-api.herokuapp.com/api/category/" + product.category_id + "/products/" + product.id,
        contentType: "application/json",
        success: function(response) {

            var productList = getProductListFromStorage();
            productList[product.id] = product;
            localStorage.setItem("productList", JSON.stringify(productList));
            reloadProducts();

            productTitle.value = "";
            productImg.value = "";
            productDesc.value = "";
            $('#productsCategoryList').attr('disabled', false);

            changeButton("new");
        }
    });
}

function removeProduct(productTitle) {
    var productList = getProductListFromStorage();

    for (var id in productList) {
        if (productList[id].title === productTitle) {
            $.ajax({
                type: "DELETE",
                url: "http://zhaw-weng-shop-api.herokuapp.com/api/category/" + productList[id].category_id + "/products/" + productList[id].id,
                contentType: "application/json",
            });
            delete productList[id];
        }
    }
    localStorage.setItem("productList", JSON.stringify(productList));
}

function getProductListFromStorage() {
    var productListFromStorage = localStorage.getItem("productList");
    var productList = {};

    if (productListFromStorage !== null) {
        productList = JSON.parse(productListFromStorage);
    }
    return productList;
}

function reloadProducts() {
    $("#productTable tr").not(function() {
        return !!$(this).has('th').length;
    }).remove();

    loadProducts();
}

function addProductToHTML(title, image_url, description, categoryId) {
    var table = document.getElementById("productTable");
    var row = table.insertRow(1);
    var cellProductTitle = row.insertCell(0);
    var cellProductImage = row.insertCell(1);
    var cellProductDescription = row.insertCell(2);
    var cellProductCategory = row.insertCell(3);
    var cellDeleteBtn = row.insertCell(4);
    var hack = generate_uuid();

    cellProductTitle.innerHTML = title;
    cellProductImage.innerHTML = image_url;
    cellProductDescription.innerHTML = description;
    cellProductCategory.innerHTML = categoryId;
    cellDeleteBtn.innerHTML = "<button id='"+hack+"' class='btn btn-danger deleteProductBtn'><span class='glyphicon glyphicon-trash'></span></button>";


    document.getElementById(hack).addEventListener("click", function(event) {
        event.stopPropagation();
        removeProductHTML(this);
    });

    $("#productTable tr").not(function() {
        return !!$(this).has('th').length;
    }).on("click", function() {
        updateProductHTML(this);
    });
}

function updateProductHTML(row) {
    var entries = $(row).children('td');

    if (entries.length == 0) {
        return;
    }

    document.getElementById("productTitle").value = entries[0].innerHTML;
    document.getElementById("productImg").value = entries[1].innerHTML;
    document.getElementById("productDesc").value = entries[2].innerHTML;
    var categoryList = getCategoryListFromStorage();
    for (var id in categoryList) {
        if (id === entries[3].innerHTML) {
            $("#productsCategoryList").find("option:contains(" + categoryList[id].title + ")").prop("selected", true);
            $('#productsCategoryList').attr('disabled', 'disabled');
        }
    }

    var oldProductValues ={"productTitle" : entries[0].innerHTML, "productImg" : entries[1].innerHTML,"productDesc" : entries[2].innerHTML, "categoryId" : entries[3].innerHTML}

    $('<input />').attr('type', 'hidden').attr('name', "update").attr('id', "oldProductValues").attr('value', JSON.stringify(oldProductValues)).appendTo('#productForm');

    changeButton("update");
}

function removeProductHTML(button) {
    var row = button.parentNode.parentNode;
    var productName = row.childNodes[0].innerHTML;
    row.parentNode.removeChild(row);
    removeProduct(productName);
}
/* ---- END Functions belonging to Product ---- */

function changeButton(value) {
    if (value == "update") {
        var button = document.getElementById("addProductBtn");
        if (button == null) {
            return
        }
        button.innerHTML = "Produkt aktualisieren";
        button.id = "updateProductBtn";
        button.classList = "btn btn-warning";
        button.removeEventListener("click", addProduct);
        button.addEventListener("click", updateProduct);
    }
    if (value == "new") {
        button = document.getElementById("updateProductBtn");
        if (button == null) {
            return
        }
        button.innerHTML = "Neues Produkt hinzuf&uuml;gen";
        button.id = "addProductBtn";
        button.classList = "btn btn-success";
        button.removeEventListener("click", updateProduct);
        button.addEventListener("click", addProduct);
    }
}

/* UUID-Generator copied from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#105074 */
function generate_uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
