import { Col, Pagination, Row, Select, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from '~/components/ProductItem';
import { changeCurrentPage, changeOrderType, changeSortType } from '../listProductsSlice';
import './custom.scss';
import styles from './MainProducts.module.scss';
import { FilterHomeProducts } from '../../../modules/products';

const { Option } = Select;
const cx = classNames.bind(styles);
export default function MainProducts() {
    const dispatch = useDispatch();
    const data = FilterHomeProducts('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(9);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = data?.data?.slice(startIndex, endIndex);
    const handleSortTypeChange = (value) => {
        dispatch(changeSortType(value));
    };
    const handleOrderByChange = (value) => {
        dispatch(changeOrderType(value));
    };

    const handleChangePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    });
    return (
        <div className="products__main-products">
            <div className={cx('top')}>
                <div className={cx('filter')}>
                    <span className={cx('showing')}>
                        Đang có <span className={cx('number')}> {data?.productsCount}</span> Sản
                        phẩm
                    </span>
                </div>

                <div className={cx('sortGroup')}>
                    <div className={cx('sort')}>
                        <label>Sắp xếp: </label>
                        <div className={cx('select')}>
                            <Select
                                value="Mặc định"
                                defaultValue="Mặc định"
                                style={{ width: 120 }}
                                // onChange={handleSortTypeChange}
                            >
                                <Option value="Mặc định">Mặc định</Option>
                                <Option value="Đánh giá cao nhất">Đánh giá cao nhất</Option>
                            </Select>
                        </div>
                    </div>
                    <div className={cx('sort')}>
                        <label>Sắp xếp: </label>
                        <div className={cx('select')}>
                            <Select
                                // value={orderType}
                                defaultValue="default"
                                style={{ width: 120 }}
                                // onChange={handleOrderByChange}
                                className="products__order-by"
                            >
                                <Option value="default">Mặc định</Option>
                                <Option value="lowest">Giá từ thấp đến cao</Option>
                                <Option value="highest">Gía từ cao xuống thấp</Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
            {/* <span className={cx('searched-message')}>
                {searchText !== ''
                    ? currentList.length > 0
                        ? `There are ${currentList.length} result for "${searchText}"`
                        : `There aren't any result for "${searchText}"`
                    : ''}
            </span> */}
            {data?.isLoading ? (
                <Row
                    gutter={[
                        { xs: 0, md: 10, lg: 20, xxl: 30 },
                        { xs: 10, sm: 10, lg: 20, xxl: 30 },
                    ]}
                >
                    {Array(3)
                        .fill(0)
                        .map((item, index) => (
                            <Col key={index} xs={24} sm={24} md={12} lg={8}>
                                <ProductItem isLoading />
                            </Col>
                        ))}
                </Row>
            ) : (
                <>
                    <ul className={cx('list')}>
                        <Row
                            gutter={[
                                { xs: 0, md: 10, lg: 20, xxl: 30 },
                                { xs: 10, sm: 10, lg: 20, xxl: 30 },
                            ]}
                        >
                            {currentProducts?.map((item, index) => (
                                <Col key={item._id} xs={24} sm={24} md={12} lg={8}>
                                    <ProductItem
                                        id={item.number}
                                        category={item.category}
                                        image={item.image}
                                        oldPrice={item.oldPrice}
                                        price={item.price}
                                        name={item.name}
                                        rate={item.ratings}
                                        countRate={item.numOfReviews}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </ul>
                    <Pagination
                        current={currentPage}
                        defaultPageSize={productsPerPage}
                        total={data?.productsCount}
                        onChange={handleChangePage}
                    />
                </>
            )}
        </div>
    );
}
