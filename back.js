document.addEventListener('DOMContentLoaded', function () {
    const products = [
        { name: 'Phở Bò đầy đủ', price: 55000, image: 'image/daydu.jpg' },
        { name: 'Phở Gà', price: 40000, image: 'image/ga.jpg' },
        { name: 'Phở Tái', price: 40000, image: 'image/tai.jpg' },
        { name: 'Phở Gân', price: 40000, image: 'image/nam.jpg' },
        { name: 'Phở Bò Viên', price: 40000, image: 'image/bovien.jpg' },
        { name: 'Trứng trần', price: 7000, image: 'image/trung.jpg' },
        { name: 'Phở Nạm', price: 40000, image: 'image/nam.jpg' },
        { name: 'Phở Tái Nạm', price: 40000, image: 'image/tai.jpg' },
    ];

    const itemsPerPage = 4;
    let currentPage = 1;

    function displayProducts(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';

        products.slice(start, end).forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'dish';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price} VND</p>
                <label for="quantity-${product.name}">Số lượng:</label>
                <input type="number" id="quantity-${product.name}" name="quantity" min="1" value="1">
                <button onclick="addToCart(
                        '${product.name.replace(/'/g, "\\'")}', 
                         ${product.price}, 
                        '${product.image.replace(/'/g, "\\'")}', 
                        document.getElementById('quantity-${product.name.replace(/'/g, "\\'")}').value
                    )">Thêm</button>
                    
            `;
            productContainer.appendChild(productDiv);
        });
    }

    function displayPagination() {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === currentPage) {
                button.className = 'active';
            }
            button.addEventListener('click', function () {
                currentPage = i;
                displayProducts(currentPage);
                displayPagination();
            });
            paginationContainer.appendChild(button);
        }
    }

    displayProducts(currentPage);
    displayPagination();

    window.showSection = function (sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    };
});

let cart = [];

// Hàm addToCart
function addToCart(name, price, image, quantity) {
    // Tạo đối tượng item với thông tin sản phẩm
    const item = { name, price, quantity: parseInt(quantity), image };
    const existingItem = cart.find(cartItem => cartItem.name === name);
    
    // Cập nhật giỏ hàng nếu sản phẩm đã có
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    // Hiển thị giỏ hàng
    displayCart();
    alert("Thêm thành công");
}

function tang(name) {
    const item = cart.find(cartItem => cartItem.name === name);
    if (item) {
        item.quantity += 1;
    }
    displayCart();
}

function giam(name) {
    const item = cart.find(cartItem => cartItem.name === name);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.name !== name);
        }
    }
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
            <span>${item.name} : ${item.price} VND <br> Số Lượng: ${item.quantity} 
            <button onclick="tang('${item.name}')"><i class="fas fa-plus"></i></button>
            <button onclick="giam('${item.name}')"><i class="fas fa-minus"></i></button> </span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    document.getElementById('totalPrice').textContent = total;
}


function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng không được rỗng khi thanh toán.");
        return;
    }
    document.getElementById('checkout').style.display = 'block';
}

document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (cart.length === 0) {
        alert("Giỏ hàng không được rỗng khi thanh toán.");
        setTimeout("location.reload(true)",3000);
        return;
    }
    document.getElementById('checkout').innerHTML = "Đặt hàng thành công! Bạn chờ 1-5 phút sẽ có người gọi điện thoại xác nhận";
    setTimeout("location.reload(true)",3000);
});

// Hiển thị hoặc ẩn hình ảnh QR dựa trên lựa chọn phương thức thanh toán
document.getElementById('paymentMethod').addEventListener('change', function () {
    const qrImage = document.getElementById('qrImage');
    if (this.value === 'card') {
        qrImage.style.display = 'block';
    } else {
        qrImage.style.display = 'none';
    }
});