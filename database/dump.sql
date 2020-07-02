--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.watchlists DROP CONSTRAINT watchlists_fk1;
ALTER TABLE ONLY public.watchlists DROP CONSTRAINT watchlists_fk0;
ALTER TABLE ONLY public.post DROP CONSTRAINT post_fk0;
ALTER TABLE ONLY public.message DROP CONSTRAINT message_fk2;
ALTER TABLE ONLY public.message DROP CONSTRAINT message_fk1;
ALTER TABLE ONLY public.message DROP CONSTRAINT message_fk0;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_fk1;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_fk0;
ALTER TABLE ONLY public.bid DROP CONSTRAINT bid_fk1;
ALTER TABLE ONLY public.bid DROP CONSTRAINT bid_fk0;
ALTER TABLE ONLY public.watchlists DROP CONSTRAINT watchlists_pk;
ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pk;
ALTER TABLE ONLY public."user" DROP CONSTRAINT user_email_key;
ALTER TABLE ONLY public.post DROP CONSTRAINT post_pk;
ALTER TABLE ONLY public.post DROP CONSTRAINT "post_imageUrl_key";
ALTER TABLE ONLY public.message DROP CONSTRAINT message_pk;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pk;
ALTER TABLE ONLY public.bid DROP CONSTRAINT bid_pk;
ALTER TABLE public.watchlists ALTER COLUMN "watchlistId" DROP DEFAULT;
ALTER TABLE public."user" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE public.post ALTER COLUMN "postId" DROP DEFAULT;
ALTER TABLE public.message ALTER COLUMN "messageId" DROP DEFAULT;
ALTER TABLE public.comments ALTER COLUMN "commentId" DROP DEFAULT;
ALTER TABLE public.bid ALTER COLUMN "bidId" DROP DEFAULT;
DROP SEQUENCE public."watchlists_watchlistId_seq";
DROP TABLE public.watchlists;
DROP SEQUENCE public."user_userId_seq";
DROP TABLE public."user";
DROP SEQUENCE public."post_postId_seq";
DROP TABLE public.post;
DROP SEQUENCE public."message_messageId_seq";
DROP TABLE public.message;
DROP SEQUENCE public."comments_commentId_seq";
DROP TABLE public.comments;
DROP SEQUENCE public."bid_bidId_seq";
DROP TABLE public.bid;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bid; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bid (
    "bidId" integer NOT NULL,
    "bidderId" integer NOT NULL,
    "postId" bigint NOT NULL,
    "currentBid" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT '2020-06-22 15:43:37.442217-07'::timestamp with time zone NOT NULL,
    "bidEnabled" boolean DEFAULT true NOT NULL
);


--
-- Name: bid_bidId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."bid_bidId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bid_bidId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."bid_bidId_seq" OWNED BY public.bid."bidId";


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    "commentId" integer NOT NULL,
    "userId" integer NOT NULL,
    comment text NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT '2020-06-22 15:43:37.442217-07'::timestamp with time zone NOT NULL
);


--
-- Name: comments_commentId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."comments_commentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_commentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."comments_commentId_seq" OWNED BY public.comments."commentId";


--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message (
    "messageId" integer NOT NULL,
    "senderId" integer NOT NULL,
    "recipientId" integer NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT '2020-06-22 15:43:37.442217-07'::timestamp with time zone NOT NULL,
    "postId" integer NOT NULL
);


--
-- Name: message_messageId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."message_messageId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_messageId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."message_messageId_seq" OWNED BY public.message."messageId";


--
-- Name: post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post (
    "postId" integer NOT NULL,
    "sellerId" integer NOT NULL,
    description text NOT NULL,
    "imageUrl" text NOT NULL,
    title text NOT NULL,
    "startingBid" integer NOT NULL,
    "biddingEnabled" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT '2020-06-22 15:43:37.442217-07'::timestamp with time zone NOT NULL,
    "expiredAt" date NOT NULL,
    category text,
    notes text
);


--
-- Name: post_postId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."post_postId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_postId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."post_postId_seq" OWNED BY public.post."postId";


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    "userId" integer NOT NULL,
    "userName" text NOT NULL,
    email text,
    password text,
    "profileImg" text,
    "coverImg" text,
    description text,
    location text,
    "createdAt" timestamp with time zone DEFAULT '2020-06-22 15:43:37.442217-07'::timestamp with time zone NOT NULL
);


--
-- Name: user_userId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."user_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."user_userId_seq" OWNED BY public."user"."userId";


--
-- Name: watchlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.watchlists (
    "watchlistId" integer NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" date DEFAULT '2020-06-22'::date NOT NULL
);


--
-- Name: watchlists_watchlistId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."watchlists_watchlistId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: watchlists_watchlistId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."watchlists_watchlistId_seq" OWNED BY public.watchlists."watchlistId";


--
-- Name: bid bidId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bid ALTER COLUMN "bidId" SET DEFAULT nextval('public."bid_bidId_seq"'::regclass);


--
-- Name: comments commentId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN "commentId" SET DEFAULT nextval('public."comments_commentId_seq"'::regclass);


--
-- Name: message messageId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message ALTER COLUMN "messageId" SET DEFAULT nextval('public."message_messageId_seq"'::regclass);


--
-- Name: post postId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post ALTER COLUMN "postId" SET DEFAULT nextval('public."post_postId_seq"'::regclass);


--
-- Name: user userId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN "userId" SET DEFAULT nextval('public."user_userId_seq"'::regclass);


--
-- Name: watchlists watchlistId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists ALTER COLUMN "watchlistId" SET DEFAULT nextval('public."watchlists_watchlistId_seq"'::regclass);


--
-- Data for Name: bid; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bid ("bidId", "bidderId", "postId", "currentBid", "createdAt", "bidEnabled") FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments ("commentId", "userId", comment, "postId", "createdAt") FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message ("messageId", "senderId", "recipientId", message, "createdAt", "postId") FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.post ("postId", "sellerId", description, "imageUrl", title, "startingBid", "biddingEnabled", "isDeleted", "createdAt", "expiredAt", category, notes) FROM stdin;
99	77	Picture of my friend wandering the beach.	/images/user-posts/photograph-15.jpg	Beach Wanderer	100	t	f	2020-07-01 17:09:54.193187-07	2020-07-31	photographs	 
100	77	Selling this painting for a friend.\nSize: 18x24	/images/user-posts/painting-17.jpg	Lysergic Energy	250	t	f	2020-07-01 17:12:30.719449-07	2020-07-25	paintings	Michelle wants atleast 250 for this
101	77	Selling this for a friend.\nSize: 24x28	/images/user-posts/painting-18.jpg	Sunset Beach	300	t	f	2020-07-01 17:14:14.485832-07	2020-07-29	paintings	Michelle wants atleast 300 for this one
102	77	Selling this for a friend.\nSize: 18x24	/images/user-posts/painting-21.jpg	Inside Wave	250	t	f	2020-07-01 17:15:13.068929-07	2020-07-28	paintings	Michelle wants atleast 250 for this
103	78	Made from wires, screws, and other random pieces of metal.\n12' x 6' x 3'\n	/images/user-posts/other-1.jpg	Junk Cycle	150	t	f	2020-07-01 17:22:05.050924-07	2020-07-28	other	\n
104	78	Flower is included but can also be removed if wanted.\nDM for dimensions.	/images/user-posts/other-2.jpg	Flower Head	150	t	f	2020-07-01 17:23:59.976487-07	2020-07-29	other	2ft x1.5ft x 1ft 
76	75	Available in various sizes.	/images/user-posts/photograph-1.jpg	Autumn Forest	100	t	f	2020-07-01 12:28:24.501509-07	2020-07-31	photographs	don't take less than $150
77	75	Long-exposure of a waterfall.\nDM me for available sizes.	/images/user-posts/photograph-2.jpg	Waterfall	150	t	f	2020-07-01 12:30:43.154892-07	2020-07-31	photographs	3 available copies\n18x12, 22x18, 28x24
78	75	A picture of these amazing lanterns I took during my trip to Japan.\nDM for available sizes.	/images/user-posts/photograph-3.jpg	Lanterns in Japan	120	t	f	2020-07-01 12:32:46.853571-07	2020-07-31	photographs	4 in stock\n(3) 12x18\n(1) 20x26
79	75	HDR photo from my trip to Greenland.\nOnly available in large sizes. DM for details.	/images/user-posts/photograph-4.jpg	Lakeside Mountain	200	t	f	2020-07-01 12:35:29.783477-07	2020-07-31	photographs	4 available
80	75	Another photograph of lanterns.\nI know, I'm obsessed.\nDM for size details.	/images/user-posts/photograph-5.jpg	Laterns 2	100	t	f	2020-07-01 12:36:41.804531-07	2020-07-31	photographs	3 prints available
81	75	Aerial drone shot of snowy mountains.\nDM for size details.	/images/user-posts/photograph-6.jpg	Drone Snow	80	t	f	2020-07-01 12:37:59.939294-07	2020-07-31	photographs	Prints in stock: 12
82	75	I was mesmerized by these flowers.	/images/user-posts/photograph-7.jpg	Flowers	50	t	f	2020-07-01 12:40:32.538498-07	2020-07-31	photographs	Jamie wanted me to save her a copy of this.
83	75	Drone shot of the mountain tops.\nIt was extremely difficult to get this picture.	/images/user-posts/photograph-8.jpg	Clouds	250	t	f	2020-07-01 12:41:43.397331-07	2020-06-30	photographs	Steph wanted this for $300
84	75	I love the beach!	/images/user-posts/photograph-9.jpg	Beach Vibes	120	t	f	2020-07-01 12:42:38.854407-07	2020-07-31	photographs	James offered $100 for a large print.
85	76	The sunrise exposing the morning dew is a magnificent wonder.\nSize: 24x30	/images/user-posts/painting-1.jpg	Morning Dew	500	t	f	2020-07-01 12:47:51.736884-07	2020-06-30	paintings	Rachel offered $500 for this.
86	76	I liked these color combinations.	/images/user-posts/painting-2.jpg	Abstract Flower	250	t	f	2020-07-01 12:50:55.903721-07	2020-07-31	paintings	Jim offered $250
87	76	I always see these mundane looking plants where I live so I wanted paint them with some drama.	/images/user-posts/painting-3.jpg	Sun Plants	300	t	f	2020-07-01 12:52:20.09116-07	2020-07-31	paintings	drew offered $300
88	76	Been getting into some abstract art to experiment with color schemes.	/images/user-posts/painting-4.jpg	Abstraction 1	100	t	f	2020-07-01 12:53:52.047234-07	2020-07-28	paintings	 
89	76	More abstract experimentation	/images/user-posts/painting-5.jpg	Abstraction 2	100	t	f	2020-07-01 12:54:39.355936-07	2020-07-26	paintings	 
90	76	I really liked the color scheme for this.	/images/user-posts/painting-6.jpg	Abstraction 3	100	t	f	2020-07-01 12:55:24.13902-07	2020-07-27	paintings	 
91	76	Can you see the boat?	/images/user-posts/painting-7.jpg	Warm Waters	250	t	f	2020-07-01 12:56:30.969152-07	2020-07-27	paintings	Hanna offered $250
92	76	I painted this one thinking of a close friend.	/images/user-posts/painting-8.jpg	Abstraction 4	200	t	f	2020-07-01 16:47:35.783551-07	2020-07-31	paintings	Jamie offered $200 for this
93	76	I painted this while I was going through heartache.	/images/user-posts/painting-9.jpg	Abstraction 5	250	t	f	2020-07-01 16:48:41.727048-07	2020-07-28	paintings	 
94	77	Photo of my model friend Emma.	/images/user-posts/photograph-10.jpg	Emma	100	t	f	2020-07-01 16:55:45.775936-07	2020-07-29	photographs	 
95	77	The beauty if these flowers struck me.	/images/user-posts/photograph-11.jpg	Flower Field	75	t	f	2020-07-01 16:58:15.93645-07	2020-07-28	photographs	 
96	77	I have prints of these available in all sizes.	/images/user-posts/photograph-12.jpg	Moraine Lake	80	t	f	2020-07-01 17:05:58.186026-07	2020-07-28	photographs	 
97	77	Festival in Portugal.\nPrints available in all sizes.\nDM for details.	/images/user-posts/photograph-13.jpg	Umbrella Festival	75	t	f	2020-07-01 17:07:01.611486-07	2020-07-24	photographs	 
98	77	The sun created a great silhouette for this girl and the moon.	/images/user-posts/photograph-14.jpg	Dusk Child	100	t	f	2020-07-01 17:08:44.083331-07	2020-07-28	photographs	 
105	78	Made from wood.\nDimensions; 2ft x 1.5ft x 2ft	/images/user-posts/other-6.jpg	Meditate	200	t	f	2020-07-01 17:25:30.144913-07	2020-08-01	other	 
106	78	Made from bronze.\nSize of a large apple.	/images/user-posts/other-7.jpg	Ganesha	300	t	f	2020-07-01 17:26:38.167743-07	2020-07-27	other	 
107	78	Made from clay.\nDimensions: 4ft x 2ft x 2ft	/images/user-posts/other-8.jpg	Young Love	700	t	f	2020-07-01 17:28:31.876677-07	2020-08-04	other	Expensive shipping. Weighs over 20lbs
108	78	Made from ivory.\nDimensions: 2ft x 1.5ft x 1.5ft	/images/user-posts/other-9.jpg	Lady	450	t	f	2020-07-01 17:29:50.882567-07	2020-07-30	other	Weights 10 lbs
109	78	Made out of rock.\nDimensions: 8" x 5" x 5"	/images/user-posts/other-13.jpg	Gautama	120	t	f	2020-07-01 17:32:13.504431-07	2020-07-29	other	 
110	78	Made from clay.\nDimensions: 2ft x 1ft x 1ft	/images/user-posts/other-20.jpg	Cover My Eyes	350	t	f	2020-07-01 17:33:42.703589-07	2020-08-05	other	Weighs 8 lbs
111	78	See no evil, hear no evil, speak no evil.\n3 separate pieces come in collection.	/images/user-posts/other-16.jpg	Three Wise Monkeys	250	t	f	2020-07-01 17:35:56.520658-07	2020-06-30	other	1 lb each.
112	79	Dimensions: 16x24	/images/user-posts/other-10.jpg	Be Brilliant	350	t	f	2020-07-01 17:40:14.288583-07	2020-07-29	other	Weights 2 lb
113	79	Dimensions: 24x30	/images/user-posts/other-5.jpg	Just Fantasy?	400	t	f	2020-07-01 17:41:41.204784-07	2020-07-28	other	Weighs 3 lbs
114	79	Dimensions: 24x18	/images/user-posts/other-12.jpg	Think Different	350	t	f	2020-07-01 17:42:44.195997-07	2020-07-28	other	Weighs 2 lbs
115	79	Dimensions: 14x14	/images/user-posts/other-15.jpg	All We Have Is Now	200	t	f	2020-07-01 17:43:44.674955-07	2020-08-04	other	weighs 1.5 lbs
116	79	Dimensions: 24x32	/images/user-posts/other-11.jpg	I Licked It	450	t	f	2020-07-01 17:44:37.790397-07	2020-08-04	other	weighs 4 lbs
117	79	Dimensions: 22x28	/images/user-posts/other-18.jpg	This Must Be The Place	400	t	f	2020-07-01 17:45:57.955745-07	2020-08-06	other	weighs 2 lbs
118	79	Dimensions: 24x28	/images/user-posts/painting-20.jpg	Purple Waves	200	t	f	2020-07-01 17:47:01.219701-07	2020-07-28	paintings	 
119	79	Dimensions: 24x18	/images/user-posts/painting-19.jpg	Phantasm	250	t	f	2020-07-01 17:47:50.467911-07	2020-07-30	paintings	 
120	79	Dimensions: 24x30	/images/user-posts/painting-15.jpg	Pink Freedom	300	t	f	2020-07-01 17:49:01.164602-07	2020-08-04	paintings	 
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" ("userId", "userName", email, password, "profileImg", "coverImg", description, location, "createdAt") FROM stdin;
78	theSculptist	thesculptist@gmail.com	\N	profile-6.jpg	cover-9.jpg	My life is sculpting and creating things.\nI also paint when I am inspired.	92618	2020-06-22 15:43:37.442217-07
79	ARTisLIFE	artislife@gmail.com	\N	profile-11.jpg	cover-12.jpg	Art is Life!\nI paint and I sculpt. I specialize in custom neon lighting. DM for commissions.	92679	2020-06-22 15:43:37.442217-07
75	mzStacey	mzstacey@gmail.com	\N	profile-1.jpg	cover-1.jpg	Beauty is everywhere.\nDM me for comissions!	92604	2020-06-22 15:43:37.442217-07
76	thatPainterLife	paint4me@gmail.com	\N	profile-2.jpg	cover-4.jpg	Painting is life. All my work is one of a kind.	92604	2020-06-22 15:43:37.442217-07
77	photoFanatic	photofanatic@gmail.com	\N	profile-8.jpg	cover-5.jpg	Taking photos is my life.\nSelling them is my livelihood.	92610	2020-06-22 15:43:37.442217-07
\.


--
-- Data for Name: watchlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.watchlists ("watchlistId", "postId", "userId", "createdAt") FROM stdin;
\.


--
-- Name: bid_bidId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."bid_bidId_seq"', 5, true);


--
-- Name: comments_commentId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."comments_commentId_seq"', 1, false);


--
-- Name: message_messageId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."message_messageId_seq"', 4, true);


--
-- Name: post_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."post_postId_seq"', 120, true);


--
-- Name: user_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."user_userId_seq"', 79, true);


--
-- Name: watchlists_watchlistId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."watchlists_watchlistId_seq"', 10, true);


--
-- Name: bid bid_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bid
    ADD CONSTRAINT bid_pk PRIMARY KEY ("bidId");


--
-- Name: comments comments_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pk PRIMARY KEY ("commentId");


--
-- Name: message message_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pk PRIMARY KEY ("messageId");


--
-- Name: post post_imageUrl_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "post_imageUrl_key" UNIQUE ("imageUrl");


--
-- Name: post post_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pk PRIMARY KEY ("postId");


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY ("userId");


--
-- Name: watchlists watchlists_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_pk PRIMARY KEY ("watchlistId");


--
-- Name: bid bid_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bid
    ADD CONSTRAINT bid_fk0 FOREIGN KEY ("bidderId") REFERENCES public."user"("userId");


--
-- Name: bid bid_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bid
    ADD CONSTRAINT bid_fk1 FOREIGN KEY ("postId") REFERENCES public.post("postId");


--
-- Name: comments comments_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_fk0 FOREIGN KEY ("userId") REFERENCES public."user"("userId");


--
-- Name: comments comments_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_fk1 FOREIGN KEY ("postId") REFERENCES public.post("postId");


--
-- Name: message message_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_fk0 FOREIGN KEY ("senderId") REFERENCES public."user"("userId");


--
-- Name: message message_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_fk1 FOREIGN KEY ("recipientId") REFERENCES public."user"("userId");


--
-- Name: message message_fk2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_fk2 FOREIGN KEY ("postId") REFERENCES public.post("postId");


--
-- Name: post post_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_fk0 FOREIGN KEY ("sellerId") REFERENCES public."user"("userId");


--
-- Name: watchlists watchlists_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_fk0 FOREIGN KEY ("postId") REFERENCES public.post("postId");


--
-- Name: watchlists watchlists_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_fk1 FOREIGN KEY ("userId") REFERENCES public."user"("userId");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

