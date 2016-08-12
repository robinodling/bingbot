CREATE TABLE users (
    uid character(10) NOT NULL,
    nick character(20) NOT NULL,
    email character(50) NOT NULL,
    first_name character(30),
    last_name character(30)
);

CREATE TABLE bing (
    id integer NOT NULL,
    uid character(10) NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    quantity integer NOT NULL,
    article text NOT NULL
);


CREATE SEQUENCE bing_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ONLY bing ALTER COLUMN id SET DEFAULT nextval('bing_id_seq'::regclass);

ALTER TABLE ONLY bing ADD CONSTRAINT bing_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY bing ADD CONSTRAINT bing_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid);

ALTER TABLE ONLY users ADD CONSTRAINT users_pkey PRIMARY KEY (uid);
