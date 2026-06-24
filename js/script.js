// Data produk (bisa disesuaikan)
        const products = [
            { id: 1, name: "Kaos Sablon Trendy", price: 50000, image: "https://via.placeholder.com/200x120/4a6fa5/ffffff?text=Kaos+Sablon" },
            { id: 2, name: "Gelang Murah", price: 15000, image: "https://via.placeholder.com/200x120/166088/ffffff?text=Gelang" },
            { id: 3, name: "Sabun Cuci Piring", price: 5000, image: "https://via.placeholder.com/200x120/4fc3f7/ffffff?text=Sabun" },
            { id: 4, name: "Keripik Lokal", price: 8000, image: "https://via.placeholder.com/200x120/28a745/ffffff?text=Keripik" },
            { id: 5, name: "Lip Balm", price: 15000, image: "https://via.placeholder.com/200x120/ffc107/ffffff?text=Lip+Balm" },
            { id: 6, name: "Kabel HP", price: 25000, image: "https://via.placeholder.com/200x120/dc3545/ffffff?text=Kabel+HP" },
            { id: 7, name: "Buku Catatan Lucu", price: 20000, image: "https://via.placeholder.com/200x120/6f42c1/ffffff?text=Buku" },
            { id: 8, name: "Stiker Decals", price: 10000, image: "https://via.placeholder.com/200x120/fd7e14/ffffff?text=Stiker" }
        ];

        // Variabel untuk menyimpan pesanan
        let order = [];
        let shippingCost = 0;

        // Muat produk ke dalam grid
        function loadProducts() {
            const productGrid = document.getElementById('productGrid');
            productGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.id = product.id;
                
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <input type="checkbox" id="product-${product.id}">
                    <div class="quantity-input" style="display: none;">
                        <button type="button" class="decrease">-</button>
                        <input type="number" value="1" min="1">
                        <button type="button" class="increase">+</button>
                    </div>
                `;
                
                productGrid.appendChild(productCard);
            });

            // Tambahkan event listener untuk setiap kartu produk
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    toggleProductSelection(productId);
                });
            });
        }

        // Toggle pemilihan produk
        function toggleProductSelection(productId) {
            const product = products.find(p => p.id === productId);
            const card = document.querySelector(`.product-card[data-id="${productId}"]`);
            const checkbox = card.querySelector('input[type="checkbox"]');
            const quantityInput = card.querySelector('.quantity-input');

            if (checkbox.checked) {
                // Hapus dari pesanan
                checkbox.checked = false;
                card.classList.remove('selected');
                quantityInput.style.display = 'none';
                
                // Hapus dari array order
                order = order.filter(item => item.id !== productId);
            } else {
                // Tambahkan ke pesanan
                checkbox.checked = true;
                card.classList.add('selected');
                quantityInput.style.display = 'flex';
                
                // Tambahkan ke array order
                order.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }

            updateTotal();
        }

        // Update total pesanan
        function updateTotal() {
            let subtotal = 0;
            order.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const total = subtotal + shippingCost;
            
            document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
            document.getElementById('shippingCost').textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
            document.getElementById('totalAmount').textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }

        // Event listener untuk tombol ubah ongkos kirim
        document.getElementById('editShipping').addEventListener('click', function() {
            const newShippingCost = prompt("Masukkan ongkos kirim (dalam Rupiah):", shippingCost);
            if (newShippingCost !== null) {
                shippingCost = parseInt(newShippingCost) || 0;
                updateTotal();
            }
        });

        // Event listener untuk tombol + dan -
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('increase')) {
                const quantityInput = e.target.parentElement.querySelector('input[type="number"]');
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateQuantity(quantityInput);
            } else if (e.target.classList.contains('decrease')) {
                const quantityInput = e.target.parentElement.querySelector('input[type="number"]');
                if (parseInt(quantityInput.value) > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    updateQuantity(quantityInput);
                }
            }
        });

        // Update jumlah pesanan
        function updateQuantity(quantityInput) {
            const productId = parseInt(quantityInput.closest('.product-card').dataset.id);
            const quantity = parseInt(quantityInput.value);
            
            const orderItem = order.find(item => item.id === productId);
            if (orderItem) {
                orderItem.quantity = quantity;
                updateTotal();
            }
        }

        // Event listener untuk form submission
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerAddress = document.getElementById('customerAddress').value;
            const notes = document.getElementById('notes').value;

            if (order.length === 0) {
                alert("Silakan pilih setidaknya satu produk.");
                return;
            }

            // Simulasikan pengiriman data (dalam aplikasi nyata, ini akan dikirim ke server)
            const orderSummary = {
                customerName,
                customerPhone,
                customerAddress,
                notes,
                order,
                shippingCost,
                total: order.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost
            };

            console.log("Pesanan diterima:", orderSummary);
            
            // Tampilkan pesan sukses
            document.getElementById('orderForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';

            // Reset form (opsional)
            // this.reset();
            // order = [];
            // shippingCost = 0;
            // updateTotal();
            // loadProducts();
        });

        // Inisialisasi
        loadProducts();
