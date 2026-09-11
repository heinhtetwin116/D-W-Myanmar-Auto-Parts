"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  CheckCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  BulbOutlined,
  TrophyOutlined,
  TeamOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Divider,
  Statistic,
} from "antd";

const { Title, Text, Paragraph } = Typography;

export default function AboutPage() {
  const params = useParams();
  const locale = params.locale as "my" | "en";
  const t = useTranslations("about");

  const values = [
    {
      icon: CheckCircleOutlined,
      title: t("values.integrity.title"),
      description: t("values.integrity.description"),
      color: "text-accent",
    },
    {
      icon: StarOutlined,
      title: t("values.quality.title"),
      description: t("values.quality.description"),
      color: "text-emerald-600",
    },
    {
      icon: UsergroupAddOutlined,
      title: t("values.customer.title"),
      description: t("values.customer.description"),
      color: "text-blue-600",
    },
    {
      icon: BulbOutlined,
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
      color: "text-amber-600",
    },
  ];

  const stats = [
    {
      icon: TrophyOutlined,
      value: "20+",
      label: locale === "my" ? "နှစ်များ၏ အတွေ့အကြုံ" : "Years Experience",
      color: "text-accent",
    },
    {
      icon: BuildOutlined,
      value: "50+",
      label: locale === "my" ? "မြို့များ၌ ပို့ဆောင်သည်" : "Cities Served",
      color: "text-emerald-600",
    },
    {
      icon: TeamOutlined,
      value: "10K+",
      label: locale === "my" ? "ဝယ်ယူသူများ" : "Happy Customers",
      color: "text-blue-600",
    },
    {
      icon: CheckCircleOutlined,
      value: "500+",
      label: locale === "my" ? "ပစ္စည်းမျိုးများ" : "Product Varieties",
      color: "text-amber-600",
    },
  ];

  const teamMembers = [
    {
      name: locale === "my" ? "ဦးသန်းထွေး" : "U Thant Twe",
      role: locale === "my" ? "ဧရည်ဝန်ကြီး (CEO)" : "Chief Executive Officer",
      bio:
        locale === "my"
          ? "၂၅ နှစ်အထက်အကုန် အုပ်စနစ်စီးပွားရေး တ Industriese Assam trabajadores"
          : "25+ years in automotive industry leadership",
    },
    {
      name: locale === "my" ? "ဒေါ်စန္ဒာဝင်း" : "Daw Sandar Win",
      role:
        locale === "my"
          ? "မှူးချုပ်စီမံခန့်ခွဲရေး (COO)"
          : "Chief Operating Officer",
      bio:
        locale === "my"
          ? "စီမံခန့်ခွဲရေး နှင့် ဂျင်းစက်ရုံး ရicules المحور"
          : "Operations & Supply Chain Management expert",
    },
    {
      name: locale === "my" ? "ဦးကျော်ဇော" : "U Kyaw Zaw",
      role:
        locale === "my"
          ? "ဂျင်ရည်ရွယ်ချက်မှူးချုပ် (CTO)"
          : "Chief Technical Officer",
      bio:
        locale === "my"
          ? "အုပ်စနစ်အင်ဂျင်နီယာရ/schemas e cathedral"
          : "Automotive Engineering specialist",
    },
  ];

  const locations = [
    {
      city: "Yangon",
      address:
        locale === "my"
          ? "နှစ် ၁၂၃၊ အုပ်စနစ်လမ်းကြောင်း၊ ရန်ကုန်မြို့"
          : "No. 123, Auto Parts Street, Yangon",
      phone: "+95 1 234 5678",
      hours:
        locale === "my"
          ? "တနင်္လာ - သောကြာနေ့: ၉:၀၀ - ၆:၀၀"
          : "Mon - Sat: 9:00 AM - 6:00 PM",
    },
    {
      city: "Mandalay",
      address:
        locale === "my"
          ? "နှစ် ၄၅၆၊ မန္တလေးစျေးဝယ်ရုံ အပတ်မှာ"
          : "No. 456, Mandalay Market Complex",
      phone: "+95 2 345 6789",
      hours:
        locale === "my"
          ? "တနင်္လာ - သောကြာနေ့: ၉:၀၀ - ၆:၀၀"
          : "Mon - Sat: 9:00 AM - 6:00 PM",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <Title
              level={1}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              {t("hero_title")}
            </Title>
            <Paragraph className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("hero_subtitle")}
            </Paragraph>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <Row gutter={32} className="items-center">
            <Col xs={24} lg={12}>
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/about-showroom.jpg"
                  alt={
                    locale === "my"
                      ? "D&W အုပ်စနစ်ပါတ်များ ရုံသားရှို�weisen"
                      : "D&W Auto Parts Showroom"
                  }
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Title
                level={2}
                className="text-3xl lg:text-4xl font-bold text-foreground mb-6"
              >
                {t("story_title")}
              </Title>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <Paragraph>{t("story_description")}</Paragraph>
                <Paragraph>{t("story_description2")}</Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Title
              level={2}
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            >
              {t("values_title")}
            </Title>
            <Paragraph className="text-muted-foreground text-lg">
              {t("values_description")}
            </Paragraph>
          </div>

          <Row gutter={[24, 16]}>
            {values.map((value, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 hex-bloom border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <value.icon className={`text-xl ${value.color}`} />
                    </div>
                    <div>
                      <Title level={4} className="text-foreground mb-2">
                        {value.title}
                      </Title>
                      <Text className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <Row gutter={32} className="items-start">
            <Col xs={24} lg={12}>
              <div className="space-y-8">
                <div>
                  <Title
                    level={2}
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                  >
                    {t("mission_title")}
                  </Title>
                  <Paragraph className="text-muted-foreground leading-relaxed">
                    {t("mission_description")}
                  </Paragraph>
                </div>
                <Divider />
                <div>
                  <Title
                    level={2}
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                  >
                    {t("vision_title")}
                  </Title>
                  <Paragraph className="text-muted-foreground leading-relaxed">
                    {t("vision_description")}
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Title
                level={2}
                className="text-3xl lg:text-4xl font-bold text-foreground mb-8"
              >
                {locale === "my"
                  ? "ကျွန်ုပ်တို့၏ ရ젝လက်ဆောင်"
                  : "Key Statistics"}
              </Title>
              <Row gutter={[24, 16]}>
                {stats.map((stat, index) => (
                  <Col key={index} xs={12} sm={12}>
                    <Card className="text-center p-6 hover:shadow-md transition-shadow hex-bloom">
                      <div className={`text-3xl mb-3 ${stat.color}`}>
                        <stat.icon />
                      </div>
                      <Statistic
                        value={stat.value}
                        prefix={<span />}
                        suffix={<span />}
                        valueStyle={{
                          fontSize: "2.5rem",
                          fontWeight: 700,
                          color: "var(--foreground)",
                        }}
                      />
                      <div className="text-sm text-muted-foreground mt-2">
                        {stat.label}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <Title
            level={2}
            className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-12"
          >
            {t("team_title")}
          </Title>
          <Paragraph className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("team_description")}
          </Paragraph>

          <Row gutter={[24, 16]}>
            {teamMembers.map((member, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <Card className="h-full hover:shadow-lg transition-shadow hex-bloom border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/50">
                      <UsergroupAddOutlined className="text-3xl" />
                    </div>
                    <div className="flex-1">
                      <Title level={4} className="text-foreground mb-1">
                        {member.name}
                      </Title>
                      <Text
                        type="secondary"
                        className="text-accent font-medium mb-3"
                      >
                        {member.role}
                      </Text>
                      <Text className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <Title
            level={2}
            className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-12"
          >
            {t("location_title")}
          </Title>
          <Paragraph className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("location_description")}
          </Paragraph>

          <Row gutter={[24, 16]} justify="center">
            {locations.map((location, index) => (
              <Col key={index} xs={24} lg={10}>
                <Card className="hover:shadow-lg transition-shadow hex-bloom border-border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Title level={4} className="text-foreground">
                        {location.city}{" "}
                        {locale === "my" ? "ရုံသားရှို�weisen" : "Showroom"}
                      </Title>
                    </div>
                    <Descriptions
                      className="text-sm"
                      column={1}
                      layout="vertical"
                    >
                      <Descriptions.Item
                        label={
                          locale === "my"
                            ? "နေရာမှ terletak imperfections"
                            : "Address"
                        }
                      >
                        {location.address}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={locale === "my" ? "ဖုန်းနံပါတ်" : "Phone"}
                      >
                        <a
                          href={`tel:${location.phone}`}
                          className="text-accent hover:underline"
                        >
                          {location.phone}
                        </a>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={locale === "my" ? "ဖွင့်ချိန်" : "Hours"}
                      >
                        {location.hours}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
}
