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

import {
  aboutLocations,
  aboutStats,
  aboutTeamMembers,
  aboutValueKeys,
} from "@/data/dummy/about";

const { Title, Text, Paragraph } = Typography;

const valueIcons = {
  integrity: CheckCircleOutlined,
  quality: StarOutlined,
  customer: UsergroupAddOutlined,
  innovation: BulbOutlined,
} as const;

const statIcons = {
  years: TrophyOutlined,
  cities: BuildOutlined,
  customers: TeamOutlined,
  products: CheckCircleOutlined,
} as const;

export default function AboutPage() {
  const params = useParams();
  const locale = params.locale as "my" | "en";
  const t = useTranslations("about");

  const values = aboutValueKeys.map((value) => ({
    icon: valueIcons[value.id],
    title: t(`values.${value.id}.title`),
    description: t(`values.${value.id}.description`),
    color: value.color,
  }));

  const stats = aboutStats.map((stat) => ({
    icon: statIcons[stat.id],
    value: stat.value,
    label: stat.label[locale],
    color: stat.color,
  }));

  const teamMembers = aboutTeamMembers.map((member) => ({
    name: member.name[locale],
    role: member.role[locale],
    bio: member.bio[locale],
  }));

  const locations = aboutLocations.map((location) => ({
    city: location.city,
    address: location.address[locale],
    phone: location.phone,
    hours: location.hours[locale],
  }));

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
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
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
                    <Card className="text-center p-6 hover:shadow-md transition-shadow ">
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
                <Card className="h-full hover:shadow-lg transition-shadow border-border">
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
                <Card className="hover:shadow-lg transition-shadow border-border">
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
