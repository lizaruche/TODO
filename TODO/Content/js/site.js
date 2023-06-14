const uriItems = '/api/TodoItems';
const uriCategories = '/api/ItemCategories';
let todos = [];
let categories = [];

function getItems() {
    getCategories();

    fetch(uriItems)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}
function getCategories() {
    fetch(uriCategories)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function addCategory() {
    const addTitleTextbox = document.getElementById('add-title');
    console.log(addTitleTextbox);
    console.log(addTitleTextbox.value);
    const item = {
        title: addTitleTextbox.value.trim()
    };

    fetch(uriCategories, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getCategories();
            addTitleTextbox.value = '';
        })
        .catch(error => console.error('Unable to add category.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const addCategoryTitle = document.getElementById('categoriesAddItem').options[document.getElementById('categoriesAddItem').selectedIndex].value;


    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        categoryId: addCategoryTitle
    };

    fetch(uriItems, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(uriItems + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function deleteCategory() {
    var categoryList = document.getElementById('categories');
    var id = categoryList.options[categoryList.selectedIndex].value;

    fetch(uriCategories + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete category.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.Id === id);
    const $select = document.querySelector('#categoriesEditItem');
    $select.value = item.CategoryId;

    document.getElementById('edit-name').value = item.Name;
    document.getElementById('edit-id').value = item.Id;
    document.getElementById('edit-isComplete').checked = item.IsComplete;
    document.getElementById('editForm').style.display = 'block';
}

function displayEditFormCategory() {
    var categoryList = document.getElementById('categories');
    var id = categoryList.options[categoryList.selectedIndex].value;
    var title = categoryList.options[categoryList.selectedIndex].innerHTML;

    document.getElementById('edit-title').value = title;
    document.getElementById('edit-id-category').value = id;
    document.getElementById('editFormCategory').style.display = 'block';
}

function updateCategory() {
    const itemId = document.getElementById('edit-id-category').value;
    const item = {
        id: parseInt(itemId, 10),
        title: document.getElementById('edit-title').value.trim()
    };
    console.log(item);

    fetch(uriCategories + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update category.', error));

    closeInput();

    return false;
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const editCategoryTitle = document.getElementById('categoriesEditItem').options[document.getElementById('categoriesEditItem').selectedIndex].value;
    
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        categoryId: parseInt(editCategoryTitle)
    };
    console.log(item);

    fetch(uriItems + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('editFormCategory').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';
    document.getElementById('counter').innerHTML = itemCount + ' ' + name;
}

function _displayCategories(data) {
    const selectCategories = document.getElementById('categories');
    const selectCategoriesAddItem = document.getElementById('categoriesAddItem');
    const selectCategoriesEditItem = document.getElementById('categoriesEditItem');

    data.forEach(item => {
        let category = document.createElement('option');
        let categoryAdd = document.createElement('option');
        let categoryEdit = document.createElement('option');
        category.value = item.Id;
        category.innerHTML = item.Title;
        categoryAdd.value = item.Id;
        categoryAdd.innerHTML = item.Title;
        categoryEdit.value = item.Id;
        categoryEdit.innerHTML = item.Title;
        selectCategories.appendChild(category);
        selectCategoriesAddItem.appendChild(categoryAdd);
        selectCategoriesEditItem.appendChild(categoryEdit);
    });

    categories = data;
    console.log(categories);
}

function _displayItems(data) {
    console.log(data);
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.checked = item.ISComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.Id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.Id + ')');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.Name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        let textNode2 = document.createTextNode(categories.find(cat => cat.Id === item.CategoryId).Title);
        td3.appendChild(textNode2);

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    todos = data;
}
