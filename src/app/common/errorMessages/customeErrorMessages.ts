export class CustomeErrorMessages{
    product={
        name:{
            required:"'Ürün Adı' boş olmamalı.",
            minLength:"'Ürün Adı', 3 karakterden büyük veya eşit olmalıdır.",
            maxLength:"'Ürün Adı', 50 karakterden küçük veya eşit olmalıdır.",
        },
        price:{
            required:"'Fiyat' boş olmamalı.",
            min:"'Fiyat' değeri '0' değerinden büyük olmalı.",
            max:"'Fiyat' değeri '1000' değerinden küçük olmalı.",
        },
        stock:{
            required:"'Stok' boş olmamalı.",
            min:"'Stok' değeri '0' değerinden büyük olmalı.",
            max:"'Stok' değeri '500' değerinden küçük olmalı.",
        },
        
    }
}