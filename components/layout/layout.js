import Head from 'next/head'
import Link from 'next/link'

import { useRouter } from "next/router";

import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap'

import PageTitle from '../pageTitle/pageTitle'

import styles from './layout.module.scss'

export const siteTitle = 'Canada\'s Vaccine Rollout Tracker'

export default function Layout({ children, pageTitle, subTitle }) {
    const router = useRouter();
    const activeRoute = (routeName) => {
        return router.asPath === routeName ? true : false;
    }
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Track Canada's Vaccine Rollout"
                />
                <meta name="og:title" content={siteTitle} />
            </Head>
            <Container fluid className={styles.main}>
                <Row style={{ height: "100%" }}>
                    <Col xs={2}>
                        <header className={styles.logo}>
                            <Link href="/">
                                <a>Vaccine <span className="fw-bold">Tracker</span></a>
                            </Link>
                        </header>
                        <Nav className="flex-column">
                            <Nav.Item className={activeRoute("/reports/ca") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link  href="/reports/ca"><a>Canada</a></Link>
                            </Nav.Item>
                            <h5 className={styles.navTitle}>Provinces</h5>
                            <Nav.Item className={activeRoute("/reports/ca-ab") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-ab"><a>Alberta</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-bc") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-bc"><a>British Columbia</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-mb") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-mb"><a>Manitoba</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-nb") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-nb"><a>New Brunswick</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-nl") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-nl"><a>Newfoundland and Labrador</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-ns") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-ns"><a>Nova Scotia</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-on") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-on"><a>Ontario</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-pe") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-pe"><a>Prince Edward Island</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-qc") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-qc"><a>Quebec</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-sk") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-sk"><a>Saskatchewan</a></Link>
                            </Nav.Item>
                            <h5 className={styles.navTitle}>Territories</h5>
                            <Nav.Item className={activeRoute("/reports/ca-nt") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-nt"><a>Northwest Territories</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-nu") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-nu"><a>Nunavut</a></Link>
                            </Nav.Item>
                            <Nav.Item className={activeRoute("/reports/ca-yk") ? `${styles.navItem} ${styles.active}`: styles.navItem}>
                                <Link href="/reports/ca-yt"><a>Yukon</a></Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col>
                        <PageTitle title={pageTitle} subTitle={subTitle}/>
                        {children}
                    </Col>
                </Row>
            </Container>
        </>
    )
}