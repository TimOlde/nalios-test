CREATE TABLE products (
    id int PRIMARY KEY,
    name varchar(255),
    created_at DATETIME
);

CREATE TABLE categories (
    id int PRIMARY KEY,
    name varchar(255),
    is_public boolean
);

-- many to many
CREATE TABLE product_categories (
    product_id int,
    category_id int,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- products in public categories
SELECT pc.product_id, pc.category_id
FROM product_categories AS pc JOIN categories AS c
    ON pc.category_id = c.id AND c.is_public;

-- amount of public categories per product
SELECT product_id, COUNT(category_id) as amount
FROM (
    SELECT pc.product_id, pc.category_id
    FROM product_categories AS pc JOIN categories AS c
    ON pc.category_id = c.id AND c.is_public
)
GROUP BY product_id;

-- with categories > 5
SELECT DISTINCT p.id, p.name
FROM products JOIN (
        SELECT product_id, COUNT(category_id) as amount
        FROM (
            SELECT pc.product_id, pc.category_id
            FROM product_categories AS pc JOIN categories AS c
            ON pc.category_id = c.id AND c.is_public
        )
        GROUP BY product_id
    ) AS pc ON p.id = pc.product_id
WHERE amount > 5;