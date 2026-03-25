import dns from "dns";

export const dnsConnect = () => {
    dns.setServers(["8.8.8.8" ,"8.8.4.4"]);
    dns.setDefaultResultOrder("ipv4first");
};